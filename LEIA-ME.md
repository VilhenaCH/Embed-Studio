# Embed Studio

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

Tudo é armazenado em `localStorage` no navegador atual. Webhooks são credenciais de envio e são salvos sem criptografia quando você solicita. Não há servidor intermediário, telemetria, dependências externas ou sincronização. Não inclua URLs reais de webhook nos arquivos do repositório.

Limpar os dados do site apaga rascunhos e webhooks. Abas privadas, bloqueio de armazenamento e falta de espaço podem impedir a persistência. O app mostra falhas de salvamento. Abas simultâneas não sincronizam o estado; prefira editar em uma aba. Para backup de uma mensagem, baixe seu JSON. Esse backup não contém destinos nem credenciais.

O navegador faz o envio diretamente aos domínios oficiais do Discord. A disponibilidade depende da conexão, das permissões e da política de acesso do Discord. Não há proxy. Se não houver confirmação por falha de rede ou tempo esgotado, confira o canal antes de repetir o envio.

Imagens devem ter URLs públicas diretas. O navegador acessa o endereço informado para renderizar a prévia. Não há upload de arquivos. A prévia tem suporte básico a Markdown; a aparência final, emojis, alinhamento e sintaxes avançadas dependem do cliente Discord. Menções são enviadas com `allowed_mentions.parse: []`, evitando notificações involuntárias.

Os imports aceitam os campos editáveis da mensagem; componentes interativos, anexos, enquetes, TTS e outras propriedades extras não são importados. JSONs de outros editores podem ter envelopes próprios que precisam ser removidos (o objeto deve conter `content` e/ou `embeds`).

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
- `assets/favicon.svg`: identidade visual local.
- `.nojekyll`: compatibilidade com hospedagem estática no Pages.

Referências: [Discord Webhooks](https://discord.com/developers/docs/resources/webhook#execute-webhook), [Embed Limits](https://discord.com/developers/docs/resources/message#embed-object-embed-limits) e [Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).

## Botões e formulários (v1.1)

Na seção **Botões e formulários**, adicione até 5 botões de link por mensagem. Cada botão tem um texto (até 80 caracteres) e uma URL http(s) (até 512 caracteres). Os botões aparecem abaixo dos embeds, são salvos nos rascunhos e incluídos na importação/exportação JSON.

**Link de formulário** preenche o texto do botão como “Preencher formulário”. Cole a URL de um formulário publicado em Google Forms, Microsoft Forms, Tally ou outro serviço. O botão abre o formulário no navegador; a criação das perguntas e o armazenamento das respostas são feitos no serviço escolhido. Este app não cria nem recebe respostas de formulários.

Formulários nativos dentro do Discord (modais), botões de confirmação, cargos e ações interativas precisam de uma aplicação Discord e de um backend que processe as interações. Esses recursos não estão incluídos na versão estática de GitHub Pages.

O envio utiliza botões de link de estilo 5 em uma Action Row e o parâmetro with_components=true. Não utiliza Components V2, preservando a compatibilidade com embeds tradicionais. JSONs com componentes diferentes dos botões de link são recusados para evitar perda silenciosa de ações.

Validação manual adicional: adicione um link e um formulário, confira a prévia, recarregue, exporte e reimporte o JSON. Envie ao seu canal de testes e confira a abertura dos destinos. Nenhum teste ou envio foi executado nesta atualização.
