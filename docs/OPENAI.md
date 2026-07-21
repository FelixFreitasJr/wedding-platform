# Geração de história com OpenAI

A geração de "Nossa história" é feita por uma Netlify Function em `netlify/functions/generate-story.mjs`. A chave da OpenAI fica somente no servidor do Netlify e nunca é enviada ao navegador.

## Variáveis de ambiente no Netlify

Configure em **Site configuration > Environment variables**:

- `OPENAI_API_KEY`: chave secreta da OpenAI.
- `OPENAI_MODEL` opcional: modelo usado na geração. Se não for informado, o projeto usa `gpt-5.6-luna`, uma opção eficiente da família GPT-5.6.

## Como usar no admin

1. Preencha tipo do evento, anfitriões/noivos, data e local.
2. Clique em **Gerar história com IA**.
3. Revise o texto gerado.
4. Clique em **Salvar configurações** para gravar no Supabase.

## Segurança

Não coloque a chave da OpenAI em arquivos JavaScript públicos. Use somente variável de ambiente no Netlify.
