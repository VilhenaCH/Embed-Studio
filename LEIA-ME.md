# Embed Studio

## Correção v1.1.1

Corrigido um erro de seleção de elementos que interrompia a inicialização antes da seção de botões. **Botões e formulários** agora aparece no início do editor, antes de Identidade da mensagem. No celular, selecione a aba **Editar**.

Para atualizar, substitua todos os arquivos do site pelo conteúdo deste pacote, preservando a pasta `assets`. As referências de JS e CSS foram versionadas para evitar reutilização dos arquivos antigos em cache. Se a versão antiga continuar aparecendo após sua publicação, recarregue com Ctrl+F5. Não limpe os dados do site: isso apagaria seus rascunhos e webhooks locais. Não foram executados testes nem envios reais nesta correção.

Editor de mensagens embed para Discord, em português, responsivo e pronto para GitHub Pages. Não precisa de instalação, banco de dados, servidor próprio ou etapa de build.

## Colocar no GitHub Pages

1. Extraia este ZIP.
2. Coloque **o conteúdo da pasta `embed-studio` na raiz do repositório**. O `index.html` deve ficar diretamente na raiz, junto de `styles.css`, `app.js`, `core.js` e da pasta `assets`.
3. No repositório, vá a **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch com os arquivos, normalmente `main`, e a pasta **/ (root)**. Salve.
6. Quando a publicação do GitHub terminar, abra a URL mostrada em Pages.

Os caminhos são relativos, então também funcionam em `https://usuario.github.io/nome-do-repositorio/`. Preserve o arquivo `.nojekyll`. O `package.json` apenas identifica o projeto; não é necessário executar npm. Não é necessário configurar secrets, tokens ou GitHub Actions.

Para abrir antes de publicar, sirva a pasta com um servidor HTTP local, como a extensão Live Server do VS Code. Abrir `index.html` por duplo clique pode bloquear os módulos JavaScript em `file://`.

## Recursos

- Editor visual e prévia aproximada do Discord, com alternância desktop/mobile.
- Seis modelos: boas-vindas, comunicado, regras, evento, atualização e em branco.
- Até 10 embeds: título, descrição com Markdown, link, cor, autor, imagens, miniatura, campos lado a lado, rodapé e data/hora.
- Nome e avatar do remetente e mensagem fora do embed.
- Contadores e validação dos limites de caracteres, campos e URLs antes do envio.
- Webhooks identificados por nome, com edição e exclusão do armazenamento local.
- Salvamento automático do trabalho atual e biblioteca de rascunhos nomeados.
- Importação, cópia e download do JSON da mensagem, sem webhooks.
- Envio direto ao Discord e suporte a tópico existente ou novo tópico de fórum.
- Tratamento de erros de acesso, webhook inexistente, limite de envio e falha de conexão.

## Como usar

1. Escolha um modelo e personalize o conteúdo.
2. Expanda as seções Autor, Campos, Imagens e Rodapé conforme precisar.
3. No Discord, abra **Configurações do canal → Integrações → Webhooks** e crie um webhook. É necessário ter permissão para gerenciar webhooks.
4. Copie a URL e salve na aba **Webhooks**. Você também pode usá-la apenas uma vez na janela de envio.
5. Clique em **Enviar mensagem**, selecione o destino e clique em **Enviar agora**.

O webhook determina o canal de destino. O aplicativo cria novas mensagens; não altera mensagens já publicadas. Para um canal de fórum, informe o ID de um tópico existente ou o nome de um novo tópico. Em um canal de texto comum, deixe esses campos vazios.

## Dados locais e limites

Textos, rascunhos e webhooks são armazenados em `localStorage`. Imagens selecionadas ficam em IndexedDB no navegador atual. Webhooks são credenciais de envio e são salvos sem criptografia quando você solicita. Não há servidor intermediário, telemetria, dependências externas ou sincronização. Não inclua URLs reais de webhook nos arquivos do repositório.

Limpar os dados do site apaga rascunhos e webhooks. Abas privadas, bloqueio de armazenamento e falta de espaço podem impedir a persistência. O app mostra falhas de salvamento. Abas simultâneas não sincronizam o estado; prefira editar em uma aba. Para backup de uma mensagem, baixe seu JSON. Esse backup não contém destinos nem credenciais.

O navegador faz o envio diretamente aos domínios oficiais do Discord. A disponibilidade depende da conexão, das permissões e da política de acesso do Discord. Não há proxy. Se não houver confirmação por falha de rede ou tempo esgotado, confira o canal antes de repetir o envio.

Imagens podem ser selecionadas do dispositivo ou usar URLs públicas diretas. O navegador acessa o endereço informado para renderizar a prévia. Imagens selecionadas são enviadas como anexos junto da mensagem. A prévia tem suporte básico a Markdown; a aparência final, emojis, alinhamento e sintaxes avançadas dependem do cliente Discord. Menções são enviadas com `allowed_mentions.parse: []`, evitando notificações involuntárias.

Os imports aceitam os campos editáveis da mensagem; componentes interativos, outros anexos, enquetes, TTS e outras propriedades extras não são importados. JSONs de outros editores podem ter envelopes próprios que precisam ser removidos (o objeto deve conter `content` e/ou `embeds`).

## Validação manual sugerida

Conforme solicitado, **não foram executados testes automatizados, testes no navegador nem envios reais**. O projeto passou por revisão estática do código. Antes de usar em um canal real:

- Abra no desktop e no celular. Confira navegação, foco por teclado e alternância Editar/Prévia.
- Edite título, descrição, cor, autor, campos, imagens e rodapé. Confira a prévia.
- Adicione, duplique, alterne e remova embeds. Verifique os limites de 10 embeds, 25 campos e 6.000 caracteres de texto combinado.
- Recarregue a página após editar e confirme a recuperação do rascunho, inclusive enquanto um campo está incompleto.
- Salve e reabra um rascunho nomeado; exporte JSON e importe de volta.
- Cadastre um webhook de um **canal de testes**, recarregue a página e confirme a persistência. Edite e remova o destino.
- Envie uma mensagem para esse canal e confira o resultado e as imagens no Discord.
- Tente um webhook inválido ou excluído e confira as mensagens de erro. Não faça envios em massa para testar limites.
- Se usar fóruns, valide separadamente um tópico existente e a criação de um novo tópico.

## Arquivos

- `index.html`: estrutura e metadados.
- `styles.css`: aparência e adaptação para celular.
- `app.js`: interface, prévia, armazenamento e envio.
- `core.js`: modelos, normalização, validação e serialização.
- `uploads.js`: seleção de imagens, armazenamento local e envio de anexos.
- `assets/favicon.svg`: identidade visual local.
- `.nojekyll`: compatibilidade com hospedagem estática no Pages.

Referências: [Discord Webhooks](https://discord.com/developers/docs/resources/webhook#execute-webhook), [Embed Limits](https://discord.com/developers/docs/resources/message#embed-object-embed-limits) e [Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).

## Botões e formulários (v1.1)

Na seção **Botões e formulários**, adicione até 5 botões de link por mensagem. Cada botão tem um texto (até 80 caracteres) e uma URL http(s) (até 512 caracteres). Os botões aparecem abaixo dos embeds, são salvos nos rascunhos e incluídos na importação/exportação JSON.

**Link de formulário** preenche o texto do botão como “Preencher formulário”. Cole a URL de um formulário publicado em Google Forms, Microsoft Forms, Tally ou outro serviço. O botão abre o formulário no navegador; a criação das perguntas e o armazenamento das respostas são feitos no serviço escolhido. Este app não cria nem recebe respostas de formulários.

Formulários nativos dentro do Discord (modais), botões de confirmação, cargos e ações interativas precisam de uma aplicação Discord e de um backend que processe as interações. Esses recursos não estão incluídos na versão estática de GitHub Pages.

O envio utiliza botões de link de estilo 5 em uma Action Row e o parâmetro with_components=true. Não utiliza Components V2, preservando a compatibilidade com embeds tradicionais. JSONs com componentes diferentes dos botões de link são recusados para evitar perda silenciosa de ações.

Validação manual adicional: adicione um link e um formulário, confira a prévia, recarregue, exporte e reimporte o JSON. Envie ao seu canal de testes e confira a abertura dos destinos. Nenhum teste ou envio foi executado nesta atualização.

## Upload de imagens (v1.2.0)

No editor, abra **Imagens → Escolher imagem** para selecionar um arquivo do computador ou celular. A seção Imagens já começa aberta e oferece upload para a imagem principal e a miniatura de cada embed. Também é possível usar uma URL. Avatar do remetente e ícones de autor/rodapé continuam usando URLs.

- Formatos: PNG, JPG/JPEG, GIF e WebP. SVG e HEIC não são aceitos.
- Limites do editor: até 10 MB por arquivo, 10 arquivos distintos e 25 MB somados por mensagem. São limites conservadores do app; o Discord também pode recusar arquivos conforme suas próprias regras.
- A seleção mostra a prévia imediatamente; o arquivo só vai para o Discord quando você confirmar o envio.
- O envio utiliza multipart/form-data, files[n], payload_json e attachment://filename. Não exige hospedagem externa de imagens nem backend.
- Os arquivos ficam em IndexedDB e acompanham os rascunhos neste navegador. Se o armazenamento falhar, a interface informa que a imagem está disponível apenas na aba atual.
- Limpar os dados do site apaga os arquivos. Imagens sem referência no trabalho atual ou nos rascunhos são removidas do armazenamento ao reabrir o app.
- O JSON contém a referência da imagem, não seus bytes. Ao importar em outro navegador, selecione as imagens novamente. O envio é bloqueado enquanto houver arquivos locais ausentes.

Substitua **todos os arquivos** ao atualizar, incluindo o novo uploads.js. As versões dos assets foram atualizadas para evitar cache antigo.

Validação manual sugerida: escolha uma imagem e uma miniatura; confira a prévia, salve um rascunho, recarregue e abra-o novamente. Troque e remova imagens, confira um formato não aceito e um arquivo maior que o limite. Envie ao seu canal de testes, inclusive junto de botões. Não foram executados testes, publicação ou envios nesta atualização.
