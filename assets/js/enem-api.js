let ENEM_LOCAL_BANK_MEMORY = null;

function bankUrl(){
  return window.ENEM_CONFIG?.LOCAL_BANK_PATH || './data/banco-questoes.json';
}

async function loadLocalBank(){
  if (ENEM_LOCAL_BANK_MEMORY) return ENEM_LOCAL_BANK_MEMORY;
  const res = await fetch(bankUrl(), { headers: { accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`Erro ${res.status} ao carregar ${bankUrl()}`);
  const loaded = await res.json();
  let bank = loaded;
  if (Array.isArray(loaded)) {
    bank = { version: 'raw-array', stats: { total: loaded.length }, questions: loaded };
  }
  if (!bank || !Array.isArray(bank.questions)) throw new Error('Banco local inválido: campo questions não encontrado.');
  ENEM_LOCAL_BANK_MEMORY = bank;
  return bank;
}

function normalizeBankAlternative(alt, index){
  const letter = String.fromCharCode(65 + index);
  if (typeof alt === 'string') return { letter, text: alt || `Alternativa ${letter}` };
  const altLetter = alt.letter || alt.letra || letter;
  return {
    letter: altLetter,
    text: alt.text || alt.texto || `Alternativa ${altLetter}`,
    file: alt.file || alt.imagem || alt.image || null
  };
}

function difficultyLabelToSlug(value){
  const v = normalizeText(value || 'media');
  if (v.startsWith('fac')) return 'facil';
  if (v.startsWith('dif')) return 'dificil';
  return v === 'media' || v === 'medio' ? 'media' : value;
}

function normalizeBankQuestion(q){
  const subjectKey = q.materia || q.subject || q.subjectKey || '';
  const subject = window.ENEM_TOPICS?.[subjectKey];
  const topicId = q.assunto || q.topic || q.topicId || 'todos';
  const topic = subject?.topics?.find(t => t.id === topicId) || { id: topicId, name: q.assuntoNome || q.assuntoNomeOriginal || q.topicName || 'Assunto' };
  const alternativesRaw = q.alternativas || q.alternatives || ['A','B','C','D','E'].map(l => ({ letter: l, text: q[`alternativa_${l.toLowerCase()}`] || `Alternativa ${l}` }));
  return {
    id: q.id,
    year: Number(q.ano || q.year || q.ano_arquivo || q.anoArquivo),
    index: q.numero || q.index || q.number || '',
    title: q.titulo || q.title || (q.numero ? `Questão ${q.numero}` : ''),
    context: q.enunciado || q.context || q.question || q.textoCompleto || q.texto_completo || '',
    alternativesIntroduction: q.comando || q.alternativesIntroduction || 'Marque a alternativa correta.',
    alternatives: alternativesRaw.map(normalizeBankAlternative),
    correctAlternative: String(q.resposta || q.correctAlternative || q.answer || q.gabarito || '').trim().toUpperCase(),
    discipline: q.areaOriginal || q.discipline || q.area_original || '',
    files: q.imagens || q.files || [],
    estimatedSubject: subjectKey,
    estimatedSubjectName: subject?.name || q.materiaNome || q.materiaOriginal || subjectKey,
    estimatedTopic: topic,
    estimatedDifficulty: difficultyLabelToSlug(q.dificuldade || q.difficulty || 'media'),
    source: q.fonte || q.source || q.arquivo || '',
    raw: q
  };
}

function matchesLocalFilters(q, filters){
  const raw = q.raw || q;
  const year = Number(q.year || raw.ano || raw.year || raw.ano_arquivo || raw.anoArquivo);
  const materia = raw.materia || raw.subject || q.estimatedSubject;
  const assunto = raw.assunto || raw.topic || q.estimatedTopic?.id;
  const dificuldade = difficultyLabelToSlug(raw.dificuldade || raw.difficulty || q.estimatedDifficulty);

  if (filters.years?.length && !filters.years.includes(year)) return false;
  if (filters.subject && filters.subject !== materia) return false;
  if (filters.topic && filters.topic !== 'todos' && filters.topic !== assunto) return false;
  if (filters.difficulty && filters.difficulty !== 'todas' && filters.difficulty !== dificuldade) return false;
  return true;
}

async function generateQuestionList(filters, onProgress){
  onProgress?.({ year: 'banco local', current: 1, total: 1, found: 0 });
  const bank = await loadLocalBank();
  const normalized = bank.questions.map(normalizeBankQuestion).filter(q => q.id && q.alternatives.length >= 2 && /^[ABCDE]$/.test(q.correctAlternative));
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
