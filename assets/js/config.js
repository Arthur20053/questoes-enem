window.ENEM_CONFIG = {
  // Depois de publicar o backend no Render, cole o link aqui se quiser deixar fixo.
  // Exemplo: "https://back-enem.onrender.com"
  BACKEND_URL: "https://back-enem.onrender.com",

  // API pública comunitária que indexa questões reais do ENEM.
  API_BASE: "https://api.enem.dev/v1",

  // Anos usados na busca. Você pode remover algum se a API estiver lenta.
  YEARS: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009],

  // Quantidade máxima por lista.
  MAX_QUESTIONS: 50
};
