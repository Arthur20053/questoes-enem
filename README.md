# Site GitHub Pages — Banco de Questões ENEM

Este é o projeto do site estático que deve ser publicado no GitHub Pages.

## Como publicar

1. Crie um repositório no GitHub somente para o site.
2. Suba o conteúdo desta pasta `github-pages-site` na raiz do repositório.
3. A raiz do repositório precisa ficar assim:

```txt
index.html
assets/
data/
README.md
.nojekyll
```

4. Vá em **Settings > Pages**.
5. Escolha **Deploy from a branch**.
6. Selecione a branch `main` e a pasta `/root`.

## Ligar com o backend do Render

Depois que o Render gerar o link do backend, abra:

```txt
assets/config.js
```

E troque:

```js
BACKEND_URL: "COLE_AQUI_O_LINK_DO_RENDER"
```

por algo assim:

```js
BACKEND_URL: "https://seu-backend.onrender.com"
```

A chave do Gemini não fica neste projeto. Ela deve ficar somente no Render como variável de ambiente `GEMINI_API_KEY`.

## Questões

O site tenta carregar questões pela API pública configurada em `ENEM_API_BASE`. Também existe o arquivo:

```txt
data/questions.json
```

Ele serve como banco local/fallback, caso você queira montar seu próprio banco depois.
