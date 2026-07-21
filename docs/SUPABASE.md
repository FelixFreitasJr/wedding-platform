# Configuração do Supabase

A integração está configurada para o projeto Supabase enviado e funciona com Supabase Auth, login Google e banco de dados. As tabelas ainda precisam ser criadas no SQL Editor do Supabase antes do primeiro uso em produção.

## 1. Criar tabelas

No painel do Supabase, abra **SQL Editor** e execute o arquivo:

```sql
-- database/supabase.sql
```

Esse schema cria:

- `event_config`: guarda a configuração do convite e do evento.
- `rsvps`: guarda as confirmações de presença.
- políticas RLS para permitir leitura pública da configuração, envio público de RSVP e gerenciamento por usuários autenticados.

## 2. Configurar autenticação Google

No Supabase, acesse **Authentication > Providers > Google** e habilite o provedor com as credenciais do Google Cloud.

Configure também as URLs permitidas em **Authentication > URL Configuration**:

- Site URL: URL de produção do Netlify, por exemplo `https://techamei.netlify.app`.
- Redirect URLs: `https://techamei.netlify.app/pages/admin.html` e a URL de preview/local usada nos testes.

## 3. Preencher dados públicos no frontend

O arquivo `assets/js/supabase-config.js` já foi preenchido com os dados públicos do projeto enviado. Se trocar de projeto, atualize:

```js
export const supabaseConfig = {
    url: "https://SEU-PROJETO.supabase.co",
    anonKey: "SUA_ANON_PUBLIC_KEY"
};
```

Use somente a `anon public key`. Nunca envie ou publique a `service_role key` no frontend.

## 4. Deploy no Netlify

Depois de criar as tabelas e configurar o Google OAuth, faça push para a branch conectada ao site `techamei`. O Netlify fará o deploy automaticamente com as rotas configuradas em `netlify.toml`.
