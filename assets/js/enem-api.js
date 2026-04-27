const CACHE_PREFIX = 'ENEM_YEAR_CACHE_V2_';

function questionTextBlob(q){
  return normalizeText([
    q.title, q.context, q.alternativesIntroduction, q.discipline, q.area, q.subject,
    ...(q.files || []).map(f => f.url || f.file || ''),
    ...(q.alternatives || []).map(a => `${a.letter || ''} ${a.text || ''}`)
  ].join(' '));
}

function mapArea(raw){
  const t = normalizeText(raw);
  if (t.includes('matematica') || t.includes('mathematics')) return 'mathematics';
  if (t.includes('linguagem') || t.includes('linguagens') || t.includes('languages')) return 'languages';
  if (t.includes('natureza') || t.includes('natural') || t.includes('science')) return 'natural-sciences';
  if (t.includes('humana') || t.includes('human')) return 'human-sciences';
  return '';
}

function getQuestionArea(q){
  return mapArea([q.discipline, q.area, q.subject, q.knowledgeArea, q.category].join(' '));
}

function normalizeAlternative(alt, index){
  const letter = alt.letter || alt.label || String.fromCharCode(65 + index);
  return {
    letter,
    text: alt.text || alt.title || alt.content || '',
    file: alt.file || alt.image || alt.url || null,
    isCorrect: Boolean(alt.isCorrect || alt.correct)
  };
}

function normalizeQuestion(raw, year){
  const alternatives = (raw.alternatives || raw.options || raw.answers || []).map(normalizeAlternative);
  let correctAlternative = raw.correctAlternative || raw.correct || raw.answer || raw.correctAnswer || '';
  if (!correctAlternative) {
    const correct = alternatives.find(a => a.isCorrect);
    if (correct) correctAlternative = correct.letter;
  }
  const index = raw.index || raw.number || raw.position || raw.id || Math.random().toString(36).slice(2);
  return {
    id: `${year}-${index}`,
    year,
    index,
    title: raw.title || raw.question || raw.statement || `Questão ${index}`,
    context: raw.context || raw.text || raw.enunciation || raw.statement || '',
    alternativesIntroduction: raw.alternativesIntroduction || raw.command || raw.prompt || '',
    alternatives,
    correctAlternative,
    discipline: raw.discipline || raw.area || raw.subject || raw.knowledgeArea || '',
    files: raw.files || raw.images || [],
    raw
  };
}

async function fetchYearQuestions(year){
  const cacheKey = `${CACHE_PREFIX}${year}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  const url = `${window.ENEM_CONFIG.API_BASE}/exams/${year}/questions`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${year}`);
  const data = await res.json();
  const list = data.questions || data.data?.questions || data.items || data || [];
  const normalized = Array.isArray(list) ? list.map(q => normalizeQuestion(q, year)).filter(q => q.alternatives.length >= 2 && q.correctAlternative) : [];
  localStorage.setItem(cacheKey, JSON.stringify(normalized));
  return normalized;
}

function scoreKeywords(blob, keywords){
  return (keywords || []).reduce((acc, k) => acc + (blob.includes(normalizeText(k)) ? 1 : 0), 0);
}

function subjectScore(q, subjectKey){
  const subject = window.ENEM_TOPICS[subjectKey];
  if (!subject) return 0;
  const blob = questionTextBlob(q);
  let score = 0;
  subject.topics.forEach(topic => { score += scoreKeywords(blob, topic.keywords); });
  if (getQuestionArea(q) === subject.area) score += 1;
  return score;
}

function detectSubject(q){
  let best = { key: '', score: 0 };
  Object.keys(window.ENEM_TOPICS).forEach(key => {
    const score = subjectScore(q, key);
    if (score > best.score) best = { key, score };
  });
  return best;
}

function detectTopic(q, subjectKey){
  const subject = window.ENEM_TOPICS[subjectKey];
  if (!subject) return { id: '', name: 'Assunto estimado', score: 0 };
  const blob = questionTextBlob(q);
  let best = { id: '', name: 'Assunto estimado', score: 0 };
  subject.topics.forEach(topic => {
    const score = scoreKeywords(blob, topic.keywords);
    if (score > best.score) best = { id: topic.id, name: topic.name, score };
  });
  return best;
}

function estimateDifficulty(q){
  const text = questionTextBlob(q);
  let points = 0;
  const cleanLen = text.length;
  if (cleanLen > 1800) points += 2;
  else if (cleanLen > 1000) points += 1;
  ['grafico','tabela','calculo','proporcao','funcao','equacao','energia','mol','probabilidade','analise','relacao','modelo'].forEach(k => {
    if (text.includes(k)) points += 1;
  });
  if ((q.files || []).length) points += 1;
  if (points >= 5) return 'dificil';
  if (points >= 3) return 'media';
  return 'facil';
}

function matchesFilters(q, filters){
  const subject = window.ENEM_TOPICS[filters.subject];
  if (!subject) return false;
  const area = getQuestionArea(q);
  const sScore = subjectScore(q, filters.subject);

  // A API normalmente separa por área, não por matéria. Por isso usamos área + palavras-chave.
  if (area && area !== subject.area) return false;
  if (filters.subject !== 'matematica' && filters.subject !== 'linguagem' && sScore === 0) return false;

  const topic = detectTopic(q, filters.subject);
  if (filters.topic !== 'todos' && topic.id !== filters.topic) return false;

  const difficulty = estimateDifficulty(q);
  if (filters.difficulty !== 'todas' && difficulty !== filters.difficulty) return false;

  return true;
}

async function generateQuestionList(filters, onProgress){
  const years = filters.years?.length ? filters.years : window.ENEM_CONFIG.YEARS;
  let pool = [];
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    onProgress?.({ year, current: i + 1, total: years.length, found: pool.length });
    try {
      const qs = await fetchYearQuestions(year);
      const matched = qs.filter(q => matchesFilters(q, filters)).map(q => ({
        ...q,
        estimatedSubject: filters.subject,
        estimatedSubjectName: window.ENEM_TOPICS[filters.subject]?.name || filters.subject,
        estimatedTopic: detectTopic(q, filters.subject),
        estimatedDifficulty: estimateDifficulty(q)
      }));
      pool.push(...matched);
    } catch (err) {
      console.warn(err);
    }
    if (pool.length >= filters.quantity * 3) break;
  }
  const unique = [];
  const seen = new Set();
  for(const q of shuffle(pool)){
    if(seen.has(q.id)) continue;
    seen.add(q.id);
    unique.push(q);
    if(unique.length >= filters.quantity) break;
  }
  return unique;
}

window.ENEM_API = {
  fetchYearQuestions,
  generateQuestionList,
  detectTopic,
  estimateDifficulty,
  getQuestionArea,
  questionTextBlob
};
