const CACHE_PREFIX = 'ENEM_YEAR_CACHE_V3_';

function localNormalize(text){
  if (typeof normalizeText === 'function') return normalizeText(text);
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function htmlToText(value){
  if (!value) return '';
  if (typeof stripHtml === 'function') return stripHtml(String(value));
  return String(value).replace(/<[^>]*>/g, ' ');
}

function questionTextBlob(q){
  return localNormalize([
    htmlToText(q.title),
    htmlToText(q.context),
    htmlToText(q.alternativesIntroduction),
    q.discipline,
    q.area,
    q.subject,
    q.knowledgeArea,
    q.category,
    q.language,
    ...(q.files || []).map(f => typeof f === 'string' ? f : (f.url || f.file || '')),
    ...(q.alternatives || []).map(a => `${a.letter || ''} ${htmlToText(a.text || '')}`)
  ].join(' '));
}

function escapeRegExp(value){
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasKeyword(blob, keyword){
  const k = localNormalize(keyword).trim();
  if (!k) return false;
  // Palavras soltas precisam bater como palavra inteira. Isso evita, por exemplo,
  // "massa" marcar "biomassa" como Física.
  if (/^[a-z0-9]+$/.test(k)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(k)}([^a-z0-9]|$)`, 'i').test(blob);
  }
  return blob.includes(k);
}

function matchedKeywords(blob, keywords){
  return (keywords || []).filter(k => hasKeyword(blob, k));
}

function weightedKeywordScore(blob, keywords, generic = []){
  const genericSet = new Set(generic.map(k => localNormalize(k)));
  let score = 0;
  const hits = [];
  for(const keyword of keywords || []){
    const k = localNormalize(keyword).trim();
    if(!hasKeyword(blob, k)) continue;
    hits.push(keyword);
    if(genericSet.has(k)) score += 0.35;
    else if(k.includes(' ') || k.length >= 8) score += 2;
    else score += 1;
  }
  return { score, hits };
}

function mapArea(raw){
  const t = localNormalize(raw);
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
    area: raw.area || '',
    subject: raw.subject || '',
    knowledgeArea: raw.knowledgeArea || '',
    category: raw.category || '',
    language: raw.language || '',
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

  const all = [];
  const limit = 180;
  let offset = 0;
  let safety = 0;

  while(safety < 5){
    const url = `${window.ENEM_CONFIG.API_BASE}/exams/${year}/questions?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${year}`);
    const data = await res.json();
    const page = data.questions || data.data?.questions || data.items || (Array.isArray(data) ? data : []);
    if(Array.isArray(page)) all.push(...page);

    const meta = data.metadata || {};
    const received = Array.isArray(page) ? page.length : 0;
    const pageLimit = Number(meta.limit || limit);
    const hasMore = Boolean(meta.hasMore);
    const total = Number(meta.total || 0);

    if(!hasMore || received === 0 || (total && all.length >= total)) break;
    offset += pageLimit;
    safety++;
  }

  const normalized = all
    .map(q => normalizeQuestion(q, year))
    .filter(q => q.alternatives.length >= 2 && q.correctAlternative);

  localStorage.setItem(cacheKey, JSON.stringify(normalized));
  return normalized;
}

const SUBJECT_PROFILES = {
  fisica: {
    area: 'natural-sciences',
    generic: ['energia', 'massa', 'potencia', 'trabalho', 'pressao', 'densidade'],
    positive: [
      'velocidade','aceleracao','forca','newton','movimento','atrito','trajetoria','queda livre','peso','equilibrio mecanico',
      'corrente eletrica','tensao eletrica','voltagem','resistor','resistencia eletrica','circuito','ohm','bateria','potencia eletrica','gerador','amperimetro','voltimetro','fio condutor',
      'calor especifico','capacidade termica','dilatacao','temperatura','conducao','conveccao','radiacao termica','maquina termica',
      'onda','frequencia','comprimento de onda','som','eco','ressonancia','decibel','ultrassom',
      'luz','espelho','lente','refracao','reflexao','imagem virtual','foco','optica',
      'empuxo','pascal','arquimedes','fluido','hidrostatica'
    ],
    negative: ['fotossintese','respiracao celular','carboidrato','biomassa','clorofila','celula','dna','gene','alelo','cromossomo','vacina','virus','bacteria','parasita','ecossistema','bioma','cadeia alimentar','planta','organismo','enzima','transgenico','fermentacao','mol','molar','ph','acido','base','pilha','eletrolise','oxidacao','reducao','hidrocarboneto','funcao organica']
  },
  quimica: {
    area: 'natural-sciences',
    generic: ['energia','carbono','massa','agua'],
    positive: [
      'solucao','concentracao','molar','mol/l','mol','diluicao','soluto','solvente','ppm','massa molar',
      'reagente','produto','equacao quimica','estequiometria','rendimento','balanceamento',
      'entalpia','exotermica','endotermica','combustao','calor de reacao',
      'pilha','eletrolise','oxidacao','reducao','anodo','catodo','corrosao','potencial de reducao',
      'hidrocarboneto','alcool','acido carboxilico','ester','funcao organica','polimero','ligacao covalente','ligacao ionica',
      'equilibrio quimico','ph','acido','base','neutralizacao','tampao','ka','kb','chuva acida','tratamento de agua','ozonio','residuo','reciclagem'
    ],
    negative: ['fotossintese','respiracao celular','celula','dna','gene','alelo','cromossomo','ecossistema','bioma','cadeia alimentar','vacina','virus','bacteria','parasita','velocidade','aceleracao','newton','resistor','circuito','espelho','lente','onda mecanica','empuxo']
  },
  biologia: {
    area: 'natural-sciences',
    generic: ['energia','populacao','comunidade'],
    positive: [
      'ecossistema','cadeia alimentar','teia alimentar','bioma','biodiversidade','sucessao ecologica','habitat','nicho ecologico',
      'gene','dna','rna','alelo','hereditariedade','cromossomo','mutacao','genotipo','fenotipo',
      'selecao natural','adaptacao','evolucao','ancestral','especie','darwin','variabilidade',
      'sistema digestorio','respiracao','circulacao','hormonio','rim','neuronio','sangue','imunidade',
      'celula','mitocondria','membrana plasmatica','organela','nucleo','fotossintese','respiracao celular','clorofila','carboidrato','biomassa',
      'vacina','virus','bacteria','parasita','epidemia','doenca','saneamento','prevencao',
      'transgenico','clonagem','enzima','biotecnologia','pcr','engenharia genetica','dna recombinante','organismo'
    ],
    negative: ['corrente eletrica','tensao','resistor','circuito','ohm','newton','velocidade','aceleracao','espelho','lente','refracao','empuxo','mol','molar','estequiometria','ph','acido','base','pilha','eletrolise']
  },
  matematica: {
    area: 'mathematics',
    generic: ['grafico','tabela'],
    positive: ['porcentagem','percentual','razao','proporcao','funcao','grafico','area','perimetro','volume','media','mediana','moda','probabilidade','juros','escala','conversao','unidade','equacao','plano cartesiano'],
    negative: []
  },
  linguagem: {
    area: 'languages',
    generic: ['texto','imagem'],
    positive: ['texto','autor','leitor','interpretacao','argumento','genero','cronica','noticia','artigo','charge','tirinha','propaganda','poema','literatura','romance','modernismo','narrador','variacao linguistica','oralidade','metafora','ironia','ambiguidade','arte','midia','publicidade','english','spanish','ingles','espanhol'],
    negative: []
  },
  filosofia: {
    area: 'human-sciences',
    generic: ['estado','poder','liberdade'],
    positive: ['filosofia','etica','moral','virtude','justica','bem','dever','contrato social','hobbes','locke','rousseau','conhecimento','razao','empirismo','racionalismo','verdade','socrates','platao','aristoteles','sofistas','mito','logos','kant','descartes','nietzsche','foucault'],
    negative: ['clima','relevo','cartografia','latitude','longitude','industrializacao brasileira','escravidao','imperio','republica velha','vargas','ditadura militar','durkheim','weber','fato social','movimento social']
  },
  sociologia: {
    area: 'human-sciences',
    generic: ['estado','poder','cidadania','cultura'],
    positive: ['sociologia','sociedade','cultura','identidade','etnocentrismo','diversidade','trabalho','capitalismo','fordismo','toyotismo','precarizacao','classe social','desigualdade','pobreza','exclusao','mobilidade social','movimento social','direitos','protesto','participacao','minoria','instituicao','politica publica','durkheim','weber','marx','fato social','acao social','mais-valia'],
    negative: ['clima','relevo','cartografia','latitude','longitude','socrates','platao','aristoteles','kant','descartes','vargas','republica velha','brasil colonia','monarquia']
  },
  historia: {
    area: 'human-sciences',
    generic: ['estado','poder','cultura'],
    positive: ['historia','colonia','colonizacao','engenho','acucar','escravidao','sesmaria','portugal','imperio','dom pedro','abolicao','cafe','monarquia','constituicao de 1824','republica','vargas','ditadura','constituicao','militar','redemocratizacao','quilombo','africano','racismo','renascimento','reforma protestante','absolutismo','mercantilismo','iluminismo','revolucao francesa','guerra mundial','guerra fria','nazismo','fascismo','patrimonio historico'],
    negative: ['latitude','longitude','cartografia','clima','vegetacao','bacia hidrografica','durkheim','weber','fato social','socrates','platao','aristoteles']
  },
  geografia: {
    area: 'human-sciences',
    generic: ['populacao','cidade','campo','meio ambiente'],
    positive: ['geografia','cartografia','mapa','escala geografica','latitude','longitude','projecao cartografica','urbanizacao','metropole','segregacao socioespacial','agropecuaria','agronegocio','reforma agraria','clima','massa de ar','vegetacao','bioma','aquecimento global','desmatamento','bacia hidrografica','solo','populacao','migracao','densidade demografica','globalizacao','bloco economico','territorio','paisagem','espaco geografico'],
    negative: ['socrates','platao','aristoteles','kant','descartes','durkheim','weber','vargas','dom pedro','republica velha','quilombo']
  }
};

function topicScore(q, subjectKey, topic){
  const blob = questionTextBlob(q);
  const profile = SUBJECT_PROFILES[subjectKey] || {};
  return weightedKeywordScore(blob, topic?.keywords || [], profile.generic || []);
}

function subjectProfileScore(q, subjectKey){
  const profile = SUBJECT_PROFILES[subjectKey];
  const subject = window.ENEM_TOPICS[subjectKey];
  if(!profile || !subject) return { score: -999, hits: [], negatives: [] };

  const area = getQuestionArea(q);
  if(area && area !== subject.area) return { score: -999, hits: [], negatives: ['area-diferente'] };

  const blob = questionTextBlob(q);
  const positive = weightedKeywordScore(blob, profile.positive || [], profile.generic || []);
  const negatives = matchedKeywords(blob, profile.negative || []);
  const bestTopic = detectTopic(q, subjectKey, false);

  let score = 0;
  if(area === subject.area) score += 2;
  score += positive.score;
  score += Math.min(bestTopic.score, 4) * 0.6;
  score -= negatives.length * 3;

  // Matemática e Linguagens já são áreas próprias no ENEM; a área da API é suficiente.
  if(['matematica','linguagem'].includes(subjectKey) && area === subject.area) score += 6;

  return { score, hits: positive.hits, negatives, bestTopic };
}

function subjectScore(q, subjectKey){
  return subjectProfileScore(q, subjectKey).score;
}

function detectSubject(q){
  let best = { key: '', score: -999, details: null };
  Object.keys(window.ENEM_TOPICS).forEach(key => {
    const details = subjectProfileScore(q, key);
    if (details.score > best.score) best = { key, score: details.score, details };
  });
  return best;
}

function detectTopic(q, subjectKey, includeFallback = true){
  const subject = window.ENEM_TOPICS[subjectKey];
  if (!subject) return { id: '', name: 'Assunto estimado', score: 0, hits: [] };
  let best = { id: '', name: 'Assunto estimado', score: 0, hits: [] };
  subject.topics.forEach(topic => {
    const result = topicScore(q, subjectKey, topic);
    if (result.score > best.score) best = { id: topic.id, name: topic.name, score: result.score, hits: result.hits };
  });
  if(!includeFallback && !best.id) return best;
  return best;
}

function estimateDifficulty(q){
  const text = questionTextBlob(q);
  let points = 0;
  const cleanLen = text.length;
  if (cleanLen > 1800) points += 2;
  else if (cleanLen > 1000) points += 1;
  ['grafico','tabela','calculo','proporcao','funcao','equacao','energia','mol','probabilidade','analise','relacao','modelo'].forEach(k => {
    if (hasKeyword(text, k)) points += 1;
  });
  if ((q.files || []).length) points += 1;
  if (points >= 5) return 'dificil';
  if (points >= 3) return 'media';
  return 'facil';
}

function minimumSubjectScore(subjectKey){
  if(['matematica','linguagem'].includes(subjectKey)) return 5;
  return 3.5;
}

function matchesSubject(q, subjectKey){
  const subject = window.ENEM_TOPICS[subjectKey];
  if(!subject) return false;

  const area = getQuestionArea(q);
  if(area && area !== subject.area) return false;

  const selected = subjectProfileScore(q, subjectKey);
  if(selected.score < minimumSubjectScore(subjectKey)) return false;

  const best = detectSubject(q);
  if(best.key && best.key !== subjectKey && best.score >= selected.score + 2) return false;

  return true;
}

function matchesFilters(q, filters){
  if(!matchesSubject(q, filters.subject)) return false;

  const topic = detectTopic(q, filters.subject);
  if (filters.topic !== 'todos') {
    if(topic.id !== filters.topic) return false;
    if(topic.score < 1) return false;
  }

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
        estimatedDifficulty: estimateDifficulty(q),
        detectedSubject: detectSubject(q)
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
  questionTextBlob,
  detectSubject,
  matchesFilters
};
