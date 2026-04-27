# Questões ENEM — GitHub Pages

Site estático multipáginas para banco de questões do ENEM.

## Páginas

- `index.html`: início
- `materias.html`: matérias e assuntos
- `gerar.html`: filtros para gerar lista
- `questoes.html`: tela para responder, corrigir, pular e pedir explicação
- `sobre.html`: informações do projeto

## Como publicar

Suba todo o conteúdo desta pasta na raiz do repositório do GitHub Pages.

A raiz deve ficar assim:

```txt
index.html
materias.html
gerar.html
questoes.html
sobre.html
404.html
assets/
.nojekyll
README.md
```

Depois ative em:

```txt
Settings > Pages > Deploy from a branch > main > /root
```

## Backend

O link do backend do Render pode ser configurado de duas formas:

1. Pela interface do site, clicando em **Configurar IA**.
2. Editando `assets/js/config.js` e colocando o link em `BACKEND_URL`.

Não coloque chave do Gemini no GitHub Pages.
