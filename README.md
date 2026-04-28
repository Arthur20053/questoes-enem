# Questões ENEM - GitHub Pages

Site multipáginas para treino de questões do ENEM.

## Como publicar

Suba o conteúdo desta pasta no repositório do GitHub Pages:

```txt
index.html
materias.html
gerar.html
questoes.html
sobre.html
404.html
assets/
data/
.nojekyll
README.md
```

## Banco de questões

As questões ficam em:

```txt
data/banco-questoes.json
```

O site lê somente esse banco local. Isso evita que a lista puxe questão de matéria errada.

## IA

O botão de explicação chama o backend Render configurado em:

```txt
assets/js/config.js
```

Valor atual:

```txt
https://back-enem.onrender.com
```
