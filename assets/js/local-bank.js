(function(){
  const BANK_PATH = './data/banco-questoes.json';
  let bankCache = null;

  function asArray(value){ return Array.isArray(value) ? value : []; }
  function normalizeBankQuestion(item){
    const alternatives = asArray(item.alternativas || item.alternatives).map((alt, index) => ({
      letter: alt.letra || alt.letter || String.fromCharCode(65 + index),
      text: alt.texto || alt.text || '',
      file: alt.arquivo || alt.file || null,
      isCorrect: Boolean(alt.isCorrect || alt.correta || (alt.letra || alt.letter) === (item.resposta || item.correctAlternative))
    }));
    return {
      id: item.id || `${item.ano || item.year}-${item.indice || item.index || Math.random().toString(36).slice(2)}`,
      year: Number(item.ano || item.year),
      index: item.indice || item.index || '',
      title: item.titulo || item.title || `Questão ${item.indice || item.index || ''}`,
      context: item.contexto || item.context || item.enunciado || '',
      alternativesIntroduction: item.comando || item.alternativesIntroduction || item.pergunta || '',
      alternatives,
      correctAlternative: item.resposta || item.correctAlternative || '',
      discipline: item.areaOriginal || item.discipline || '',
      language: item.idioma || item.language || '',
      files: item.arquivos || item.files || [],
      estimatedSubject: item.materia || item.estimatedSubject || '',
      estimatedSubjectName: item.materiaNome || item.estimatedSubjectName || '',
      estimatedTopic: { id: item.assunto || item.topic || '', name: item.assuntoNome || item.topicName || 'Assunto' },
      estimatedDifficulty: item.dificuldade || item.estimatedDifficulty || 'media',
      bankItem: item
    };
  }

  async function loadLocalBank(){
    if(bankCache) return bankCache;
    try{
      const res = await fetch(BANK_PATH, { cache: 'no-store' });
      if(!res.ok) throw new Error('Banco local ausente');
      const data = await res.json();
      const raw = asArray(data.questions);
      bankCache = raw.map(normalizeBankQuestion).filter(q => q.correctAlternative && q.alternatives.length >= 2);
      return bankCache;
    }catch(err){
      bankCache = [];
      return bankCache;
    }
  }

  function matchBankQuestion(q, filters){
    const item = q.bankItem || {};
    if(filters.subject && filters.subject !== 'todos' && item.materia !== filters.subject) return false;
    if(filters.topic && filters.topic !== 'todos' && item.assunto !== filters.topic) return false;
    if(filters.difficulty && filters.difficulty !== 'todas' && item.dificuldade !== filters.difficulty) return false;
    if(filters.years && filters.years.length && !filters.years.includes(Number(item.ano || q.year))) return false;
    return true;
  }

  function shuffleLocal(arr){
    const copy=[...arr];
    for(let i=copy.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
    return copy;
  }

  const original = window.ENEM_API && window.ENEM_API.generateQuestionList;
  async function generateFromBankOrApi(filters, onProgress){
    const bank = await loadLocalBank();
    if(bank.length){
      onProgress && onProgress({year:'banco local',current:1,total:1,found:bank.length});
      const matched = bank.filter(q => matchBankQuestion(q, filters));
      return shuffleLocal(matched).slice(0, filters.quantity || window.ENEM_CONFIG.MAX_QUESTIONS || 50);
    }
    if(typeof original === 'function') return original(filters, onProgress);
    return [];
  }

  window.ENEM_BANK = { loadLocalBank, normalizeBankQuestion };
  if(window.ENEM_API) window.ENEM_API.generateQuestionList = generateFromBankOrApi;
})();
