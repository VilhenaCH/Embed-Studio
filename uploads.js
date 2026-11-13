// Local binary storage, separate from the small JSON drafts in localStorage.
const files = new Map();
const previews = new Map();
let database = null;
export const FILE_LIMIT = 10 * 1024 * 1024;
export const TOTAL_LIMIT = 25 * 1024 * 1024;
export const isAttachment = url => /^attachment:\/\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|gif|webp)$/.test(url || '');
const filenameOf = url => (url || '').slice('attachment://'.length);
export function localFile(url) { return isAttachment(url) ? files.get(filenameOf(url)) : undefined; }
export function localPreview(url) {
  const entry = localFile(url);
  if (!entry) return '';
  if (!previews.has(entry.filename)) previews.set(entry.filename, URL.createObjectURL(entry.blob));
  return previews.get(entry.filename);
}
export function attachmentURLs(message) {
  return [...new Set((message.embeds || []).flatMap(e => [e.image?.url, e.thumbnail?.url]).filter(isAttachment))];
}
export async function initializeUploads(messages) {
  try {
    database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('embedstudio.images.v1', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('images', {keyPath: 'filename'});
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Armazenamento ocupado.'));
    });
    database.onversionchange = () => { database.close(); database = null; };
    const stored = await new Promise((resolve, reject) => {
      const request = database.transaction('images').objectStore('images').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const used = new Set(messages.flatMap(attachmentURLs).map(filenameOf));
    const transaction = database.transaction('images', 'readwrite');
    for (const entry of stored) {
      if (used.has(entry.filename) && entry.blob instanceof Blob) { entry.saved = true; files.set(entry.filename, entry); }
      else transaction.objectStore('images').delete(entry.filename);
    }
    transaction.onerror = () => {}; // Cleanup failure must not block the editor.
  } catch { database = null; }
}
export async function storeImage(file) {
  if (!file.size) throw Error('Selecione uma imagem que não esteja vazia.');
  if (file.size > FILE_LIMIT) throw Error('Use uma imagem de até 10 MB.');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const matches = (offset, values) => values.every((v, i) => bytes[offset + i] === v);
  let ext, type;
  if (matches(0, [137,80,78,71,13,10,26,10])) { ext = 'png'; type = 'image/png'; }
  else if (matches(0, [255,216,255])) { ext = 'jpg'; type = 'image/jpeg'; }
  else if (matches(0, [71,73,70,56]) && [55,57].includes(bytes[4]) && bytes[5] === 97) { ext = 'gif'; type = 'image/gif'; }
  else if (matches(0, [82,73,70,70]) && matches(8, [87,69,66,80])) { ext = 'webp'; type = 'image/webp'; }
  else throw Error('Formato não aceito. Escolha uma imagem PNG, JPG, GIF ou WebP.');
  const filename = `imagem_${crypto.randomUUID()}.${ext}`;
  const entry = {filename, name:file.name, blob:file.slice(0,file.size,type)};
  files.set(filename, entry);
  let saved = false;
  if (database) {
    try {
      await new Promise((resolve, reject) => {
        const transaction = database.transaction('images', 'readwrite');
        transaction.objectStore('images').put(entry);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
      saved = true;
    } catch { /* Keep it available for sending in this tab. */ }
  }
  entry.saved = saved;
  return {url:`attachment://${filename}`, saved};
}
export function uploadErrors(message) {
  const urls = attachmentURLs(message), errors = [];
  if (urls.length > 10) errors.push('Use até 10 arquivos de imagem diferentes por mensagem.');
  let size = 0;
  for (const url of urls) {
    const entry = localFile(url);
    if (!entry) errors.push('Uma imagem local está indisponível. Selecione o arquivo novamente na seção Imagens.');
    else { size += entry.blob.size; if (entry.blob.size > FILE_LIMIT) errors.push('Uma imagem ultrapassa 10 MB.'); }
  }
  if (size > TOTAL_LIMIT) errors.push('As imagens somadas ultrapassam o limite de 25 MB do editor.');
  return [...new Set(errors)];
}
export function prepareRequest(payload) {
  const urls = attachmentURLs(payload);
  if (!urls.length) return {headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)};
  const errors = uploadErrors(payload);
  if (errors.length) throw Error(errors[0]);
  const form = new FormData();
  const attachments = urls.map((url,id) => {
    const entry = localFile(url);
    form.append(`files[${id}]`, entry.blob, entry.filename);
    return {id, filename:entry.filename};
  });
  form.append('payload_json', JSON.stringify({...payload,attachments}));
  // The browser supplies Content-Type with the multipart boundary.
  return {body:form};
}
