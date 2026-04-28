window.ENEM_CONFIG = {
  // Link do backend no Render para o botão "Explicar resposta".
  BACKEND_URL: "https://back-enem.onrender.com",

  // Agora o site usa banco local curado, não busca questões pela API na hora.
  LOCAL_BANK_PATH: "./data/banco-questoes.json",

  // Pedido atual: 2015 até 2025. O site só mostra questões que existirem no banco local.
  YEARS: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],

  MAX_QUESTIONS: 50
};
