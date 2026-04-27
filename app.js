const CONFIG = window.APP_CONFIG || {};
const ENEM_API_BASE = CONFIG.ENEM_API_BASE || "https://api.enem.dev/v1";
const BACKEND_URL = CONFIG.BACKEND_URL || "";

const TOPICS = {
  todas: [
    ["todos", "Todos os assuntos"]
  ],
  linguagens: [
    ["todos", "Todos os assuntos"],
    ["interpretacao", "Interpretação de texto"],
    ["generos-textuais", "Gêneros textuais"],
    ["gramatica", "Gramática"],
    ["literatura", "Literatura"],
    ["arte", "Arte"],
    ["educacao-fisica", "Educação física"],
    ["ingles", "Inglês"],
    ["espanhol", "Espanhol"]
  ],
  "ciencias-humanas": [
    ["todos", "Todos os assuntos"],
    ["historia-brasil", "História do Brasil"],
    ["historia-geral", "História geral"],
    ["geografia-fisica", "Geografia física"],
    ["geografia-humana", "Geografia humana"],
    ["filosofia", "Filosofia"],
    ["sociologia", "Sociologia"],
    ["politica-cidadania", "Política e cidadania"],
    ["economia-trabalho", "Economia e trabalho"]
  ],
  "ciencias-natureza": [
    ["todos", "Todos os assuntos"],
    ["biologia", "Biologia geral"],
    ["ecologia", "Ecologia"],
    ["genetica", "Genética"],
    ["fisiologia", "Fisiologia"],
    ["quimica-geral", "Química geral"],
    ["fisico-quimica", "Físico-química"],
    ["quimica-organica", "Química orgânica"],
    ["mecanica", "Física: mecânica"],
    ["eletricidade", "Física: eletricidade"],
    ["ondas-optica", "Física: ondas e óptica"],
    ["termodinamica", "Física: termodinâmica"]
  ],
  matematica: [
    ["todos", "Todos os assuntos"],
    ["aritmetica", "Aritmética"],
    ["porcentagem", "Porcentagem"],
    ["razao-proporcao", "Razão e proporção"],
    ["funcoes", "Funções"],
    ["geometria-plana", "Geometria plana"],
    ["geometria-espacial", "Geometria espacial"],
    ["estatistica", "Estatística"],
    ["probabilidade", "Probabilidade"],
    ["analise-combinatoria", "Análise combinatória"]
  ]
};

const KEYWORDS = {
  "interpretacao": ["texto", "infere", "inferir", "leitura", "sentido", "efeito de sentido", "argumento", "opinião", "interpretação"],
  "generos-textuais": ["gênero", "charge", "tirinha", "propaganda", "anúncio", "poema", "crônica", "notícia", "campanha", "artigo"],
  "gramatica": ["pronome", "verbo", "concordância", "regência", "pontuação", "coesão", "conectivo", "oração", "período"],
  "literatura": ["literatura", "romantismo", "realismo", "modernismo", "poesia", "narrador", "verso", "eu lírico"],
  "arte": ["arte", "artístico", "pintura", "música", "dança", "teatro", "imagem", "vanguarda"],
  "educacao-fisica": ["corpo", "esporte", "ginástica", "jogo", "dança", "atividade física"],
  "ingles": ["inglês", "english"],
  "espanhol": ["espanhol", "spanish"],

  "historia-brasil": ["brasil", "colônia", "império", "república", "ditadura", "escravidão", "getúlio", "vargas", "independência"],
  "historia-geral": ["revolução", "guerra", "idade média", "iluminismo", "industrial", "francesa", "mundial", "colonização"],
  "geografia-fisica": ["clima", "relevo", "vegetação", "bioma", "hidrografia", "solo", "erosão", "chuva"],
  "geografia-humana": ["urbanização", "população", "migração", "globalização", "território", "cidade", "rede urbana", "industrialização"],
  "filosofia": ["ética", "moral", "filósofo", "kant", "aristóteles", "platão", "sócrates", "razão", "conhecimento"],
  "sociologia": ["sociedade", "cultura", "identidade", "classe social", "durkheim", "weber", "marx", "desigualdade"],
  "politica-cidadania": ["cidadania", "democracia", "estado", "direitos", "constituição", "política", "poder"],
  "economia-trabalho": ["trabalho", "capital", "produção", "consumo", "mercado", "economia", "tecnologia"],

  "biologia": ["célula", "organismo", "metabolismo", "enzima", "tecido", "evolução", "bactéria", "vírus"],
  "ecologia": ["ecossistema", "cadeia alimentar", "biodiversidade", "ambiente", "poluição", "desmatamento", "sustentabilidade", "bioma"],
  "genetica": ["dna", "gene", "genética", "hereditariedade", "cromossomo", "alelo", "mutação"],
  "fisiologia": ["sangue", "respiração", "digestão", "hormônio", "sistema nervoso", "circulação", "rim"],
  "quimica-geral": ["átomo", "molécula", "substância", "mistura", "ligação química", "tabela periódica", "íon"],
  "fisico-quimica": ["concentração", "solução", "ph", "entalpia", "equilíbrio", "cinética", "oxidação", "redução", "pilha"],
  "quimica-organica": ["carbono", "orgânico", "hidrocarboneto", "álcool", "ácido carboxílico", "éster", "amina"],
  "mecanica": ["força", "velocidade", "aceleração", "movimento", "energia cinética", "trabalho", "potência", "atrito"],
  "eletricidade": ["corrente", "resistor", "tensão", "voltagem", "circuito", "elétrico", "potência elétrica"],
  "ondas-optica": ["onda", "frequência", "comprimento de onda", "luz", "espelho", "lente", "som"],
  "termodinamica": ["calor", "temperatura", "termodinâmica", "dilatação", "gás", "pressão"],

  "aritmetica": ["número", "soma", "subtração", "multiplicação", "divisão", "inteiro", "decimal"],
  "porcentagem": ["porcentagem", "%", "percentual", "taxa", "aumento", "desconto"],
  "razao-proporcao": ["razão", "proporção", "escala", "diretamente proporcional", "inversamente proporcional", "regra de três"],
  "funcoes": ["função", "gráfico", "equação", "linear", "quadrática", "afim", "exponencial"],
  "geometria-plana": ["área", "perímetro", "triângulo", "quadrado", "retângulo", "círculo", "ângulo"],
  "geometria-espacial": ["volume", "cubo", "cilindro", "cone", "esfera", "prisma", "pirâmide"],
  "estatistica": ["média", "mediana", "moda", "desvio", "gráfico", "tabela", "frequência"],
  "probabilidade": ["probabilidade", "chance", "aleatório", "evento", "dado", "sorteio"],
  "analise-combinatoria": ["combinação", "permutação", "arranjo", "possibilidades", "maneiras"]
};

const state = {
  list: [],
  current: 0,
  selected: null,
  answeredCurrent: false,
  stats: { answered: 0, correct: 0, wrong: 0, skipped: 0 },
  cache: new Map()
};

const els = {
  discipline: document.querySelector("#discipline"),
  topic: document.querySelector("#topic"),
  difficulty: document.querySelector("#difficulty"),
  amount: document.querySelector("#amount"),
  generateBtn: document.querySelector("#generateBtn"),
  emptyState: document.querySelector("#emptyState"),
  loadingState: document.querySelector("#loadingState"),
  questionView: document.querySelector("#questionView"),
  progress: document.querySelector("#progress"),
  questionTitle: document.querySelector("#questionTitle"),
  questionMeta: document.querySelector("#questionMeta"),
  questionFiles: document.querySelector("#questionFiles"),
  questionContext: document.querySelector("#questionContext"),
  alternativesIntro: document.querySelector("#alternativesIntro"),
  alternatives: document.querySelector("#alternatives"),
  answerBtn: document.querySelector("#answerBtn"),
  explainBtn: document.querySelector("#explainBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  skipBtn: document.querySelector("#skipBtn"),
  feedback: document.querySelector("#feedback"),
  explanationBox: document.querySelector("#explanationBox"),
  answeredCount: document.querySelector("#answeredCount"),
  correctCount: document.querySelector("#correctCount"),
  wrongCount: document.querySelector("#wrongCount"),
  skippedCount: document.querySelector("#skippedCount")
};

function normalizeText(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function safeText(text = "") {
  return String(text ?? "").trim();
}

function questionText(q) {
  return [
    q.title,
    q.context,
    q.alternativesIntroduction,
    ...(q.alternatives || []).map(a => a.text || "")
  ].join(" ");
}

function topicLabel(topicValue) {
  const all = Object.values(TOPICS).flat();
  const found = all.find(([value]) => value === topicValue);
  return found ? found[1] : "Assunto estimado";
}

function inferTopic(q) {
  const text = normalizeText(questionText(q));
  const candidates = TOPICS[q.discipline] || TOPICS.todas;
  let best = { value: "todos", label: "Assunto geral", score: 0 };

  for (const [value, label] of candidates) {
    if (value === "todos") continue;
    const words = KEYWORDS[value] || [];
    let score = 0;
    for (const word of words) {
      if (text.includes(normalizeText(word))) score++;
    }
    if (score > best.score) best = { value, label, score };
  }

  return best.value === "todos" ? { value: "geral", label: "Assunto geral" } : best;
}

function estimateDifficulty(q) {
  const text = questionText(q);
  const length = text.length;
  const hasFiles = Array.isArray(q.files) && q.files.length > 0;
  const altLength = (q.alternatives || []).reduce((sum, alt) => sum + String(alt.text || "").length, 0);
  let score = 0;

  if (length > 1800) score += 2;
  else if (length > 900) score += 1;

  if (altLength > 900) score += 1;
  if (hasFiles) score += 1;
  if (normalizeText(text).match(/calcule|valor|equacao|grafico|tabela|porcentagem|probabilidade|funcao|energia|concentracao/)) score += 1;

  if (score <= 1) return "facil";
  if (score <= 3) return "media";
  return "dificil";
}

function difficultyLabel(value) {
  return {
    facil: "Fácil",
    media: "Média",
    dificil: "Difícil"
  }[value] || "Estimativa";
}

function updateTopics() {
  const discipline = els.discipline.value;
  const topics = TOPICS[discipline] || TOPICS.todas;

  els.topic.innerHTML = "";
  for (const [value, label] of topics) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    els.topic.appendChild(option);
  }
}

function selectedYears() {
  return Array.from(document.querySelectorAll('input[name="year"]:checked'))
    .map(input => Number(input.value))
    .filter(Boolean)
    .sort((a, b) => b - a);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

async function fetchQuestionsForYear(year) {
  if (state.cache.has(year)) return state.cache.get(year);

  const url = `${ENEM_API_BASE}/exams/${year}/questions?limit=200&offset=0`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${year}: HTTP ${response.status}`);
  }

  const data = await response.json();
  const questions = Array.isArray(data.questions) ? data.questions : [];
  state.cache.set(year, questions);
  return questions;
}

async function loadQuestions() {
  const years = selectedYears();

  if (!years.length) {
    throw new Error("Selecione pelo menos um ano.");
  }

  const loaded = [];
  const errors = [];

  for (const year of years) {
    try {
      const questions = await fetchQuestionsForYear(year);
      loaded.push(...questions);
    } catch (error) {
      console.warn(error);
      errors.push(String(error.message || error));
    }
  }

  if (!loaded.length) {
    throw new Error("Não consegui carregar questões da API pública. Confira sua internet ou tente novamente.");
  }

  return loaded;
}

function filterQuestions(questions) {
  const discipline = els.discipline.value;
  const topic = els.topic.value;
  const difficulty = els.difficulty.value;
  const amount = Math.min(Math.max(Number(els.amount.value || 50), 1), 50);

  let filtered = questions.filter(q => {
    const qDiscipline = q.discipline || "";
    if (discipline !== "todas" && qDiscipline !== discipline) return false;

    const qTopic = inferTopic(q);
    if (topic !== "todos" && qTopic.value !== topic) return false;

    const qDifficulty = estimateDifficulty(q);
    if (difficulty !== "todas" && qDifficulty !== difficulty) return false;

    return Array.isArray(q.alternatives) && q.alternatives.length >= 2 && q.correctAlternative;
  });

  return shuffle(filtered).slice(0, amount);
}

function setScreen(mode) {
  els.emptyState.classList.toggle("hidden", mode !== "empty");
  els.loadingState.classList.toggle("hidden", mode !== "loading");
  els.questionView.classList.toggle("hidden", mode !== "question");
}

function updateStats() {
  els.answeredCount.textContent = state.stats.answered;
  els.correctCount.textContent = state.stats.correct;
  els.wrongCount.textContent = state.stats.wrong;
  els.skippedCount.textContent = state.stats.skipped;
}

function resetCurrentUI() {
  state.selected = null;
  state.answeredCurrent = false;
  els.feedback.className = "feedback hidden";
  els.feedback.textContent = "";
  els.explanationBox.className = "explanation hidden";
  els.explanationBox.innerHTML = "";
  els.explainBtn.disabled = true;
  els.nextBtn.classList.add("hidden");
  els.answerBtn.disabled = false;
}

function renderImage(url, altText = "Imagem da questão") {
  const img = document.createElement("img");
  img.src = url;
  img.alt = altText;
  img.loading = "lazy";
  img.onerror = () => img.remove();
  return img;
}

function renderQuestion() {
  const q = state.list[state.current];

  if (!q) {
    setScreen("empty");
    els.emptyState.innerHTML = `
      <h2>Lista finalizada</h2>
      <p>Você respondeu ${state.stats.answered}, acertou ${state.stats.correct}, errou ${state.stats.wrong} e pulou ${state.stats.skipped}.</p>
    `;
    return;
  }

  resetCurrentUI();
  setScreen("question");

  const topic = inferTopic(q);
  const difficulty = estimateDifficulty(q);

  els.progress.textContent = `Questão ${state.current + 1}/${state.list.length}`;
  els.questionTitle.textContent = q.title || `Questão ${q.index || ""} - ENEM ${q.year || ""}`;
  els.questionMeta.textContent = [
    q.year ? `ENEM ${q.year}` : "",
    q.discipline ? `Área: ${disciplineName(q.discipline)}` : "",
    topic.label ? `Assunto: ${topic.label}` : "",
    `Dificuldade estimada: ${difficultyLabel(difficulty)}`
  ].filter(Boolean).join(" • ");

  els.questionFiles.innerHTML = "";
  if (Array.isArray(q.files)) {
    q.files.filter(Boolean).forEach(file => {
      els.questionFiles.appendChild(renderImage(file));
    });
  }

  els.questionContext.textContent = safeText(q.context || "Questão sem enunciado textual carregado. Verifique se a questão possui imagem acima.");
  els.alternativesIntro.textContent = safeText(q.alternativesIntroduction || "Assinale a alternativa correta:");
  els.alternatives.innerHTML = "";

  for (const alt of q.alternatives || []) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "alternative";
    btn.dataset.letter = alt.letter;

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = alt.letter;

    const content = document.createElement("span");
    content.className = "alt-content";
    const text = document.createElement("span");
    text.textContent = safeText(alt.text);
    content.appendChild(text);

    if (alt.file) content.appendChild(renderImage(alt.file, `Imagem da alternativa ${alt.letter}`));

    btn.appendChild(letter);
    btn.appendChild(content);
    btn.addEventListener("click", () => selectAlternative(alt.letter));
    els.alternatives.appendChild(btn);
  }
}

function disciplineName(value) {
  return {
    linguagens: "Linguagens",
    "ciencias-humanas": "Ciências Humanas",
    "ciencias-natureza": "Ciências da Natureza",
    matematica: "Matemática"
  }[value] || value;
}

function selectAlternative(letter) {
  if (state.answeredCurrent) return;
  state.selected = letter;
  document.querySelectorAll(".alternative").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.letter === letter);
  });
}

function answerCurrent() {
  const q = state.list[state.current];

  if (!q) return;

  if (!state.selected) {
    showFeedback("Escolha uma alternativa antes de responder.", "warn");
    return;
  }

  const correct = q.correctAlternative;
  const isRight = state.selected === correct;

  document.querySelectorAll(".alternative").forEach(btn => {
    const letter = btn.dataset.letter;
    btn.disabled = true;
    if (letter === correct) btn.classList.add("correct");
    if (letter === state.selected && !isRight) btn.classList.add("wrong");
  });

  state.answeredCurrent = true;
  state.stats.answered += 1;
  if (isRight) {
    state.stats.correct += 1;
    showFeedback(`Você acertou! A alternativa correta é ${correct}.`, "ok");
  } else {
    state.stats.wrong += 1;
    showFeedback(`Você errou. Sua escolha foi ${state.selected}, mas a alternativa correta é ${correct}.`, "no");
  }

  updateStats();
  els.answerBtn.disabled = true;
  els.explainBtn.disabled = false;
  els.nextBtn.classList.remove("hidden");
}

function showFeedback(message, type) {
  els.feedback.textContent = message;
  els.feedback.className = `feedback ${type}`;
}

function nextQuestion() {
  state.current += 1;
  renderQuestion();
}

function skipQuestion() {
  if (!state.answeredCurrent) {
    state.stats.skipped += 1;
    updateStats();
  }
  nextQuestion();
}

function backendReady() {
  return BACKEND_URL && !BACKEND_URL.includes("COLE_AQUI") && /^https?:\/\//.test(BACKEND_URL);
}

async function explainCurrent() {
  const q = state.list[state.current];
  if (!q) return;

  if (!backendReady()) {
    els.explanationBox.className = "explanation";
    els.explanationBox.innerHTML = `
      <strong>Backend ainda não configurado.</strong>
      <p>Publique a pasta <code>render-backend</code> no Render e depois cole o link gerado em <code>assets/config.js</code>.</p>
    `;
    return;
  }

  els.explainBtn.disabled = true;
  els.explanationBox.className = "explanation";
  els.explanationBox.innerHTML = `<div class="spinner small-spinner"></div><p>Gerando explicação com IA...</p>`;

  try {
    const topic = inferTopic(q);
    const payload = {
      question: {
        title: q.title,
        year: q.year,
        discipline: disciplineName(q.discipline),
        topic: topic.label,
        difficulty: difficultyLabel(estimateDifficulty(q)),
        context: q.context,
        alternativesIntroduction: q.alternativesIntroduction,
        alternatives: (q.alternatives || []).map(a => ({
          letter: a.letter,
          text: a.text
        }))
      },
      selectedLetter: state.selected,
      correctLetter: q.correctAlternative
    };

    const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/api/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    els.explanationBox.textContent = data.explanation || "Não foi possível gerar a explicação.";
  } catch (error) {
    els.explanationBox.innerHTML = `
      <strong>Não consegui gerar a explicação.</strong>
      <p>${safeText(error.message || error)}</p>
      <p>Confira se o backend do Render está online e se a variável <code>GEMINI_API_KEY</code> foi cadastrada.</p>
    `;
  } finally {
    els.explainBtn.disabled = false;
  }
}

async function generateList() {
  setScreen("loading");
  els.generateBtn.disabled = true;

  state.current = 0;
  state.selected = null;
  state.answeredCurrent = false;
  state.stats = { answered: 0, correct: 0, wrong: 0, skipped: 0 };
  updateStats();

  try {
    const questions = await loadQuestions();
    state.list = filterQuestions(questions);

    if (!state.list.length) {
      setScreen("empty");
      els.emptyState.innerHTML = `
        <h2>Nenhuma questão encontrada com esses filtros</h2>
        <p>Tente selecionar “Todos os assuntos” ou “Todas as dificuldades”. Como assunto e dificuldade são estimados, alguns filtros podem ficar restritos demais.</p>
      `;
      return;
    }

    renderQuestion();
  } catch (error) {
    setScreen("empty");
    els.emptyState.innerHTML = `
      <h2>Erro ao gerar lista</h2>
      <p>${safeText(error.message || error)}</p>
    `;
  } finally {
    els.generateBtn.disabled = false;
  }
}

els.discipline.addEventListener("change", updateTopics);
els.generateBtn.addEventListener("click", generateList);
els.answerBtn.addEventListener("click", answerCurrent);
els.explainBtn.addEventListener("click", explainCurrent);
els.nextBtn.addEventListener("click", nextQuestion);
els.skipBtn.addEventListener("click", skipQuestion);

updateTopics();
updateStats();
