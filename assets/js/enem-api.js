const BANK_CACHE_KEY = 'ENEM_LOCAL_BANK_CACHE_V1';

function bankUrl(){
  return './data/banco-questoes.json';
}

async function loadLocalBank(){
  const cached = sessionStorage.getItem(BANK_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  const res = await fetch(bankUrl(), { headers: { accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`Erro ${res.status} ao carregar data/banco-questoes.json`);
  const bank = await res.json();
  if (!bank || !Array.isArray(bank.questions)) throw new Error('Banco local inválido: campo questions não encontrado.');
  sessionStorage.setItem(BANK_CACHE_KEY, JSON.stringify(bank));
  return bank;
}

function normalizeBankAlternative(alt, index){
  if (typeof alt === 'string') return { letter: String.fromCharCode(65 + index), text: alt };
  return {
    letter: alt.letter || alt.letra || String.fromCharCode(65 + index),
    text: alt.text || alt.texto || '',
    file: alt.file || alt.imagem || alt.image || null
  };
}

function normalizeBankQuestion(q){
  const subjectKey = q.materia || q.subject || q.subjectKey || '';
  const subject = window.ENEM_TOPICS?.[subjectKey];
  const topicId = q.assunto || q.topic || q.topicId || 'todos';
  const topic = subject?.topics?.find(t => t.id === topicId) || { id: topicId, name: q.assuntoNome || q.topicName || 'Assunto' };
  return {
    id: q.id,
    year: Number(q.ano || q.year),
    index: q.numero || q.index || q.number || '',
    title: q.titulo || q.title || (q.numero ? `Questão ${q.numero}` : ''),
    context: q.enunciado || q.context || q.question || '',
    alternativesIntroduction: q.comando || q.alternativesIntroduction || 'Marque a alternativa correta.',
    alternatives: (q.alternativas || q.alternatives || []).map(normalizeBankAlternative),
    correctAlternative: q.resposta || q.correctAlternative || q.answer || '',
    discipline: q.areaOriginal || q.discipline || '',
    files: q.imagens || q.files || [],
    estimatedSubject: subjectKey,
    estimatedSubjectName: subject?.name || q.materiaNome || subjectKey,
    estimatedTopic: topic,
    estimatedDifficulty: q.dificuldade || q.difficulty || 'media',
    source: q.fonte || q.source || '',
    raw: q
  };
}

function matchesLocalFilters(q, filters){
  const raw = q.raw || q;
  const year = Number(q.year || raw.ano || raw.year);
  const materia = raw.materia || raw.subject || q.estimatedSubject;
  const assunto = raw.assunto || raw.topic || q.estimatedTopic?.id;
  const dificuldade = raw.dificuldade || raw.difficulty || q.estimatedDifficulty;

  if (filters.years?.length && !filters.years.includes(year)) return false;
  if (filters.subject && filters.subject !== materia) return false;
  if (filters.topic && filters.topic !== 'todos' && filters.topic !== assunto) return false;
  if (filters.difficulty && filters.difficulty !== 'todas' && filters.difficulty !== dificuldade) return false;
  return true;
}

async function generateQuestionList(filters, onProgress){
  onProgress?.({ year: 'banco local', current: 1, total: 1, found: 0 });
  const bank = await loadLocalBank();
  const normalized = bank.questions.map(normalizeBankQuestion).filter(q => q.id && q.alternatives.length >= 2 && q.correctAlternative);
  const pool = normalized.filter(q => matchesLocalFilters(q, filters));
  const unique = [];
  const seen = new Set();
  for (const q of shuffle(pool)) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    unique.push(q);
    if (unique.length >= filters.quantity) break;
  }
  onProgress?.({ year: 'banco local', current: 1, total: 1, found: unique.length });
  return unique;
}

async function getBankStats(){
  const bank = await loadLocalBank();
  return bank.stats || { total: bank.questions?.length || 0 };
}

window.ENEM_API = {
  loadLocalBank,
  generateQuestionList,
  getBankStats
};
