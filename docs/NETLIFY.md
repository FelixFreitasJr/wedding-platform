# Deploy no Netlify

Este projeto é um site estático e não precisa de etapa de build. O arquivo `netlify.toml` publica a raiz do repositório e cria rotas amigáveis para as principais telas.

## Configuração do site `techamei`

Como o repositório já foi conectado ao projeto `techamei` no Netlify, use as configurações abaixo em **Site configuration > Build & deploy**:

- **Build command:** deixe vazio.
- **Publish directory:** `.`
- **Production branch:** a branch principal do repositório.

Depois de fazer push para a branch conectada, o Netlify deve iniciar o deploy automaticamente. O Supabase já está apontando para o projeto enviado; crie as tabelas com `database/supabase.sql` antes de usar em produção.

## Rotas publicadas

- `/` abre o site público do casamento.
- `/convite` abre a tela de convite gerada pelo cadastro do admin.
- `/rsvp` abre a confirmação de presença.
- `/login` abre a tela de login e cadastro de administradores.
- `/admin` abre o painel administrativo.

## Observações importantes

Com `assets/js/supabase-config.js` preenchido, autenticação, configurações do evento e RSVPs são sincronizados com Supabase. Para a geração de história com IA, configure `OPENAI_API_KEY` nas variáveis de ambiente do Netlify.
