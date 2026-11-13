export const blankEmbed = () => ({title:'',description:'',url:'',color:'#5865f2',author:{name:'',url:'',icon_url:''},footer:{text:'',icon_url:''},image:{url:''},thumbnail:{url:''},fields:[],timestamp:''});
function restoreDraftBase(raw){
 const str=v=>typeof v==='string'?v:'';
 if(!raw||!Array.isArray(raw.embeds)||!raw.embeds.length)throw Error('Rascunho inválido.');
 return {username:str(raw.username),avatar_url:str(raw.avatar_url),content:str(raw.content),embeds:raw.embeds.slice(0,10).map(e=>{
  const b=blankEmbed();for(const key of ['title','description','url','timestamp','color'])if(typeof e?.[key]==='string')b[key]=e[key];
  for(const key of ['author','footer','image','thumbnail'])for(const sub of Object.keys(b[key]))b[key][sub]=str(e?.[key]?.[sub]);
  b.fields=Array.isArray(e?.fields)?e.fields.slice(0,25).map(f=>({name:str(f?.name),value:str(f?.value),inline:!!f?.inline})):[];return b;
 })};
}
export const templates = [
 {name:'Boas-vindas',icon:'✦',color:'#5865f2',desc:'Uma boa primeira impressão.',title:'Seu lugar na comunidade. ✨',body:'Que bom ter você por aqui!\n\nEste é um espaço para **trocar ideias, fazer conexões e construir juntos**. Fique à vontade para chegar e participar.',fields:[{name:'📌 Comece por aqui',value:'Leia as regras e conheça os canais.',inline:true},{name:'💬 Diga um oi',value:'Apresente-se para a comunidade.',inline:true},{name:'Precisa de uma mão?',value:'Nossa equipe está por perto. Procure um moderador!',inline:false}]},
 {name:'Comunicado',icon:'◈',color:'#e69a38',desc:'Novidades que merecem destaque.',title:'Tem novidade por aqui! 📣',body:'Uma atualização importante para nossa comunidade.\n\n**O que mudou?**\nConte aqui a novidade e como ela impacta os membros.',fields:[{name:'Quando começa?',value:'Insira a data e o horário.',inline:true},{name:'Saiba mais',value:'Inclua os próximos passos.',inline:true}]},
 {name:'Regras',icon:'☷',color:'#42a58c',desc:'Um espaço melhor para todos.',title:'Nosso combinado 🤝',body:'Uma comunidade boa se constrói com respeito.\nLeia as orientações antes de participar.',fields:[{name:'1. Respeite as pessoas',value:'Discorde das ideias com educação. Assédio e discriminação não são bem-vindos.'},{name:'2. Use o canal certo',value:'Mantenha os assuntos organizados e evite spam.'},{name:'3. Cuide da comunidade',value:'Se encontrar um problema, fale com a moderação.'}]},
 {name:'Evento',icon:'▣',color:'#a16ae8',desc:'Reúna a comunidade.',title:'Nosso próximo encontro 🎉',body:'Reserve um espaço na agenda e venha participar!\n\nConte aqui o que está preparado para o evento.',fields:[{name:'📅 Quando',value:'Defina a data e o fuso horário.',inline:true},{name:'📍 Onde',value:'Informe o canal do encontro.',inline:true}]},
 {name:'Atualização',icon:'↗',color:'#389cce',desc:'Tudo o que acaba de chegar.',title:'O que há de novo 🚀',body:'Mais uma atualização chegou. Confira as mudanças:',fields:[{name:'Novidades',value:'• Descreva os novos recursos.'},{name:'Melhorias',value:'• Conte o que ficou melhor.'},{name:'Correções',value:'• Liste os problemas resolvidos.'}]},
 {name:'Em branco',icon:'+',color:'#8991a9',desc:'Sua ideia, do começo.',title:'',body:'',fields:[]}
];
export function fromTemplate(i){const t=templates[i];return {username:'Comunidade',avatar_url:'',content:'',embeds:[{...blankEmbed(),title:t.title,description:t.body,color:t.color,author:{name:i===5?'':'Um espaço para se conectar',url:'',icon_url:''},footer:{text:i===5?'':'Feito com carinho para nossa comunidade',icon_url:''},fields:structuredClone(t.fields)}]};}
export const escapeHTML = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeURL(s){try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
export function markdown(s){let text=escapeHTML(s);text=text.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,(_,label,url)=>{const decoded=url.replace(/&amp;/g,'&');return safeURL(decoded)?`<a href="${escapeHTML(decoded)}" target="_blank" rel="noopener noreferrer">${label}</a>`:label;});return text.replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/__(.+?)__/g,'<u>$1</u>').replace(/~~(.+?)~~/g,'<del>$1</del>').replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,'<em>$1</em>').replace(/\n/g,'<br>');}
export function webhookURL(value){try{const u=new URL(value.trim());if(u.protocol!=='https:'||!['discord.com','ptb.discord.com','canary.discord.com','discordapp.com'].includes(u.hostname)||u.port||u.username||u.password||!/^\/api\/(?:v\d+\/)?webhooks\/\d{16,22}\/[\w-]+\/?$/.test(u.pathname))return null;u.hash='';u.search='';u.pathname=u.pathname.replace(/\/$/,'');return u;}catch{return null;}}
function payloadBase(m){const result={allowed_mentions:{parse:[]},embeds:m.embeds.map(e=>{const o={color:parseInt(e.color.slice(1),16)};for(const k of ['title','description','url','timestamp'])if(e[k])o[k]=e[k];if(e.author.name)o.author=Object.fromEntries(Object.entries(e.author).filter(([,v])=>v));if(e.footer.text)o.footer=Object.fromEntries(Object.entries(e.footer).filter(([,v])=>v));for(const k of ['image','thumbnail'])if(e[k].url)o[k]={url:e[k].url};if(e.fields.length)o.fields=e.fields.map(f=>({name:f.name,value:f.value,inline:!!f.inline}));return o;}).filter(e=>Object.keys(e).length>1)};for(const k of ['username','avatar_url','content'])if(m[k])result[k]=m[k];return result;}
function validateBase(m){const errors=[];let total=0;const len=(v,max,label)=>{if(v.length>max)errors.push(`${label}: limite de ${max} caracteres.`);};len(m.content,2000,'Mensagem');len(m.username,80,'Remetente');if(m.avatar_url&&!safeURL(m.avatar_url))errors.push('URL do avatar inválida.');if(m.embeds.length>10)errors.push('Use até 10 embeds.');m.embeds.forEach((e,i)=>{const p=`Embed ${i+1}`;for(const [v,max,label] of [[e.title,256,'título'],[e.description,4096,'descrição'],[e.author.name,256,'autor'],[e.footer.text,2048,'rodapé']]){len(v,max,`${p}, ${label}`);total+=v.trim().length;}if(!/^#[0-9a-f]{6}$/i.test(e.color))errors.push(`${p}: cor inválida.`);if(e.fields.length>25)errors.push(`${p}: use até 25 campos.`);e.fields.forEach(f=>{len(f.name,256,`${p}, nome do campo`);len(f.value,1024,`${p}, valor do campo`);total+=f.name.trim().length+f.value.trim().length;if(!f.name.trim()||!f.value.trim())errors.push(`${p}: preencha o nome e o texto de cada campo.`);});for(const url of [e.url,e.author.url,e.author.icon_url,e.footer.icon_url,e.image.url,e.thumbnail.url])if(url&&!safeURL(url))errors.push(`${p}: use URLs completas com http:// ou https://.`);if(e.timestamp&&isNaN(Date.parse(e.timestamp)))errors.push(`${p}: data inválida.`);if((e.author.url||e.author.icon_url)&&!e.author.name)errors.push(`${p}: informe o nome do autor.`);if(e.footer.icon_url&&!e.footer.text)errors.push(`${p}: informe o texto do rodapé.`);});if(total>6000)errors.push('Os textos dos embeds ultrapassam 6000 caracteres no total.');const p=payload(m);if(!(p.content||'').trim()&&!p.embeds.length&&!p.components?.length)errors.push('Adicione um texto ou conteúdo ao embed.');return {errors:[...new Set(errors)],total};}
function importPayloadBase(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('O JSON deve ser um objeto de mensagem.');const str=x=>typeof x==='string'?x:'';const embeds=raw.embeds??[];if(!Array.isArray(embeds)||embeds.length>10)throw Error('Use um array com até 10 embeds.');const m={username:str(raw.username),avatar_url:str(raw.avatar_url),content:str(raw.content),embeds:embeds.map(e=>{if(!e||typeof e!=='object')throw Error('Embed inválido.');const b=blankEmbed();for(const k of ['title','description','url','timestamp'])b[k]=str(e[k]);if(e.color!==undefined){if(!Number.isInteger(e.color)||e.color<0||e.color>16777215)throw Error('A cor deve ser um número entre 0 e 16777215.');b.color='#'+e.color.toString(16).padStart(6,'0');}for(const k of ['author','footer','image','thumbnail'])for(const key of Object.keys(b[k]))b[k][key]=str(e[k]?.[key]);if(e.fields!==undefined&&!Array.isArray(e.fields))throw Error('Campos devem ser um array.');b.fields=(e.fields||[]).map(f=>({name:str(f?.name),value:str(f?.value),inline:!!f?.inline}));return b;})};if(!m.embeds.length)m.embeds=[blankEmbed()];const check=validate(m);if(check.errors.length)throw Error(check.errors[0]);return m;}

// Link buttons work with incoming webhooks without an application backend.
export function restoreDraft(raw){
 const m=restoreDraftBase(raw);
 m.buttons=Array.isArray(raw.buttons)?raw.buttons.slice(0,5).map(b=>({label:typeof b?.label==='string'?b.label:'',url:typeof b?.url==='string'?b.url:''})):[];
 return m;
}
export function payload(m){
 const p=payloadBase(m);
 if(m.buttons?.length)p.components=[{type:1,components:m.buttons.map(b=>({type:2,style:5,label:b.label,url:b.url}))}];
 return p;
}
export function validate(m){
 const result=validateBase(m);
 if((m.buttons?.length||0)>5)result.errors.push('Use até 5 botões por mensagem.');
 (m.buttons||[]).forEach((b,i)=>{
  if(!b.label.trim()||b.label.length>80)result.errors.push('Botão '+(i+1)+': informe um texto de até 80 caracteres.');
  if(!safeURL(b.url)||b.url.length>512)result.errors.push('Botão '+(i+1)+': informe uma URL http(s) válida de até 512 caracteres.');
 });
 return result;
}
export function importPayload(raw){
 const buttons=[];
 if(raw?.components!==undefined){
  if(!Array.isArray(raw.components)||raw.components.length>1)throw Error('Importe até uma linha com 5 botões de link.');
  for(const row of raw.components){
   if(row?.type!==1||!Array.isArray(row.components))throw Error('Somente linhas de botões de link são aceitas.');
   for(const b of row.components){
    if(b?.type!==2||b.style!==5||typeof b.label!=='string'||typeof b.url!=='string'||b.custom_id)throw Error('Somente botões de link com texto e URL são aceitos.');
    buttons.push({label:b.label,url:b.url});
   }
  }
 }
 // Validate the base message after stripping components. A button-only message
 // receives temporary content just for normalization, then is validated intact.
 const source={...raw};
 if(buttons.length&&!source.content&&!(source.embeds||[]).length)source.content=' ';
 const m=importPayloadBase({...source,content:source.content===' '&&buttons.length?'Prévia':source.content});
 if(source.content===' '&&buttons.length)m.content='';
 m.buttons=buttons;
 const check=validate(m);if(check.errors.length)throw Error(check.errors[0]);return m;
}
