window.ENEM_TOPICS = {
  fisica: {
    name: "Física",
    emoji: "⚡",
    area: "natural-sciences",
    description: "Energia, movimento, eletricidade, ondas, calor e situações do cotidiano.",
    topics: [
      { id: "mecanica", name: "Mecânica", keywords: ["força", "velocidade", "aceleração", "movimento", "atrito", "newton", "trajetória", "queda", "peso", "massa"] },
      { id: "energia-trabalho", name: "Energia, trabalho e potência", keywords: ["energia", "trabalho", "potência", "rendimento", "joule", "watt", "cinética", "potencial"] },
      { id: "eletricidade", name: "Eletricidade", keywords: ["corrente", "tensão", "voltagem", "resistor", "resistência", "circuito", "ohm", "potência elétrica", "bateria", "tomada"] },
      { id: "calorimetria", name: "Calorimetria e termologia", keywords: ["calor", "temperatura", "calor específico", "capacidade térmica", "dilatação", "condução", "convecção", "radiação"] },
      { id: "ondas", name: "Ondas e acústica", keywords: ["onda", "frequência", "comprimento de onda", "som", "eco", "ressonância", "decibel", "ultrassom"] },
      { id: "optica", name: "Óptica", keywords: ["luz", "espelho", "lente", "refração", "reflexão", "imagem", "foco", "óptica"] },
      { id: "hidrostatica", name: "Hidrostática", keywords: ["pressão", "empuxo", "densidade", "fluido", "líquido", "pascal", "arquimedes"] }
    ]
  },
  quimica: {
    name: "Química",
    emoji: "🧪",
    area: "natural-sciences",
    description: "Transformações da matéria, soluções, reações, estequiometria e química ambiental.",
    topics: [
      { id: "solucoes", name: "Soluções e concentração", keywords: ["solução", "concentração", "molar", "mol/L", "diluição", "soluto", "solvente", "ppm"] },
      { id: "estequiometria", name: "Estequiometria", keywords: ["mol", "massa molar", "reagente", "produto", "equação química", "proporção", "rendimento"] },
      { id: "termoquimica", name: "Termoquímica", keywords: ["entalpia", "exotérmica", "endotérmica", "combustão", "calor de reação", "energia liberada"] },
      { id: "eletroquimica", name: "Eletroquímica", keywords: ["pilha", "eletrólise", "oxidação", "redução", "ânodo", "cátodo", "corrosão"] },
      { id: "organica", name: "Química orgânica", keywords: ["carbono", "hidrocarboneto", "álcool", "ácido carboxílico", "éster", "função orgânica", "polímero"] },
      { id: "equilibrio", name: "Equilíbrio químico e pH", keywords: ["equilíbrio", "ph", "ácido", "base", "neutralização", "tampão", "ka", "kb"] },
      { id: "ambiental", name: "Química ambiental", keywords: ["poluição", "tratamento de água", "chuva ácida", "efeito estufa", "ozônio", "resíduo", "reciclagem"] }
    ]
  },
  biologia: {
    name: "Biologia",
    emoji: "🧬",
    area: "natural-sciences",
    description: "Ecologia, saúde, genética, evolução, fisiologia e biotecnologia.",
    topics: [
      { id: "ecologia", name: "Ecologia", keywords: ["ecossistema", "cadeia alimentar", "teia alimentar", "bioma", "população", "comunidade", "biodiversidade", "sucessão"] },
      { id: "genetica", name: "Genética", keywords: ["gene", "dna", "rna", "alelo", "hereditariedade", "cromossomo", "mutação", "genótipo", "fenótipo"] },
      { id: "evolucao", name: "Evolução", keywords: ["seleção natural", "adaptação", "evolução", "ancestral", "espécie", "darwin", "variabilidade"] },
      { id: "fisiologia", name: "Fisiologia humana", keywords: ["sistema digestório", "respiração", "circulação", "hormônio", "rim", "neurônio", "sangue", "imunidade"] },
      { id: "citologia", name: "Citologia", keywords: ["célula", "mitocôndria", "membrana", "organelas", "núcleo", "fotossíntese", "respiração celular"] },
      { id: "saude", name: "Saúde e doenças", keywords: ["vacina", "vírus", "bactéria", "parasita", "epidemia", "doença", "saneamento", "prevenção"] },
      { id: "biotecnologia", name: "Biotecnologia", keywords: ["transgênico", "clonagem", "enzima", "biotecnologia", "pcr", "engenharia genética", "dna recombinante"] }
    ]
  },
  matematica: {
    name: "Matemática",
    emoji: "📐",
    area: "mathematics",
    description: "Porcentagem, funções, geometria, estatística, probabilidade e interpretação de gráficos.",
    topics: [
      { id: "porcentagem", name: "Porcentagem e razão", keywords: ["porcentagem", "%", "percentual", "aumento", "desconto", "taxa", "razão", "proporção"] },
      { id: "funcoes", name: "Funções", keywords: ["função", "gráfico", "linear", "quadrática", "afim", "exponencial", "crescimento", "decrescimento"] },
      { id: "geometria-plana", name: "Geometria plana", keywords: ["área", "perímetro", "triângulo", "círculo", "quadrado", "retângulo", "polígono", "ângulo"] },
      { id: "geometria-espacial", name: "Geometria espacial", keywords: ["volume", "cilindro", "cone", "esfera", "prisma", "pirâmide", "capacidade"] },
      { id: "estatistica", name: "Estatística", keywords: ["média", "mediana", "moda", "desvio", "frequência", "tabela", "gráfico", "amostra"] },
      { id: "probabilidade", name: "Probabilidade", keywords: ["probabilidade", "chance", "evento", "sorteio", "combinação", "arranjo", "permutação"] },
      { id: "financeira", name: "Matemática financeira", keywords: ["juros", "montante", "capital", "parcela", "financiamento", "lucro", "prejuízo"] },
      { id: "escala", name: "Escala e unidades", keywords: ["escala", "mapa", "conversão", "unidade", "metro", "litro", "quilômetro", "medida"] }
    ]
  },
  linguagem: {
    name: "Linguagens",
    emoji: "📚",
    area: "languages",
    description: "Interpretação textual, gêneros, literatura, linguagem verbal/não verbal e variação linguística.",
    topics: [
      { id: "interpretacao", name: "Interpretação de texto", keywords: ["texto", "autor", "leitor", "sentido", "interpretação", "inferir", "ideia central", "argumento"] },
      { id: "generos", name: "Gêneros textuais", keywords: ["gênero", "crônica", "notícia", "artigo", "charge", "tirinha", "propaganda", "poema", "resenha"] },
      { id: "literatura", name: "Literatura", keywords: ["literatura", "poema", "romance", "modernismo", "narrador", "personagem", "verso", "estrofe"] },
      { id: "variacao", name: "Variação linguística", keywords: ["variação", "norma", "regional", "oralidade", "linguagem coloquial", "preconceito linguístico"] },
      { id: "semantica", name: "Semântica e figuras", keywords: ["metáfora", "ironia", "ambiguidade", "sentido figurado", "conotação", "denotação"] },
      { id: "artes-midias", name: "Artes, mídias e tecnologia", keywords: ["arte", "imagem", "mídia", "fotografia", "tecnologia", "internet", "publicidade", "design"] },
      { id: "ingles-espanhol", name: "Inglês/Espanhol", keywords: ["english", "spanish", "inglês", "espanhol", "foreign", "language"] }
    ]
  },
  filosofia: {
    name: "Filosofia",
    emoji: "🏛️",
    area: "human-sciences",
    description: "Ética, política, conhecimento, cidadania, razão, modernidade e filosofia clássica.",
    topics: [
      { id: "etica", name: "Ética e moral", keywords: ["ética", "moral", "virtude", "valor", "dever", "justiça", "bem", "liberdade"] },
      { id: "politica", name: "Filosofia política", keywords: ["estado", "contrato social", "poder", "democracia", "cidadania", "hobbes", "locke", "rousseau"] },
      { id: "conhecimento", name: "Teoria do conhecimento", keywords: ["conhecimento", "razão", "empirismo", "racionalismo", "verdade", "ciência", "método"] },
      { id: "antiga", name: "Filosofia antiga", keywords: ["sócrates", "platão", "aristóteles", "polis", "sofistas", "mito", "logos"] },
      { id: "moderna", name: "Filosofia moderna e contemporânea", keywords: ["kant", "descartes", "marx", "nietzsche", "foucault", "iluminismo", "modernidade"] }
    ]
  },
  sociologia: {
    name: "Sociologia",
    emoji: "👥",
    area: "human-sciences",
    description: "Cultura, trabalho, desigualdade, movimentos sociais, cidadania e instituições.",
    topics: [
      { id: "cultura", name: "Cultura e identidade", keywords: ["cultura", "identidade", "etnocentrismo", "diversidade", "patrimônio", "tradição", "costume"] },
      { id: "trabalho", name: "Trabalho e sociedade", keywords: ["trabalho", "industrialização", "capitalismo", "fordismo", "toyotismo", "precarização", "classe"] },
      { id: "desigualdade", name: "Desigualdade social", keywords: ["desigualdade", "pobreza", "exclusão", "mobilidade", "classe social", "renda"] },
      { id: "movimentos", name: "Movimentos sociais", keywords: ["movimento social", "direitos", "protesto", "participação", "cidadania", "luta", "minoria"] },
      { id: "instituicoes", name: "Estado, instituições e poder", keywords: ["estado", "instituição", "poder", "democracia", "política pública", "cidadania"] },
      { id: "teoricos", name: "Clássicos da sociologia", keywords: ["durkheim", "weber", "marx", "fato social", "ação social", "mais-valia"] }
    ]
  },
  historia: {
    name: "História",
    emoji: "📜",
    area: "human-sciences",
    description: "Brasil, mundo contemporâneo, cidadania, conflitos, escravidão, república e patrimônio.",
    topics: [
      { id: "brasil-colonia", name: "Brasil Colônia", keywords: ["colônia", "colonização", "engenho", "açúcar", "escravidão", "sesmaria", "portugal"] },
      { id: "brasil-imperio", name: "Brasil Império", keywords: ["império", "dom pedro", "abolição", "café", "monarquia", "constituição de 1824"] },
      { id: "brasil-republica", name: "Brasil República", keywords: ["república", "vargas", "ditadura", "democracia", "constituição", "militar", "redemocratização"] },
      { id: "escravidao", name: "Escravidão e relações étnico-raciais", keywords: ["escravidão", "quilombo", "negro", "africano", "abolição", "racismo", "cotas"] },
      { id: "idade-moderna", name: "Idade Moderna", keywords: ["renascimento", "reforma", "absolutismo", "mercantilismo", "iluminismo", "revolução francesa"] },
      { id: "mundo-contemporaneo", name: "Mundo contemporâneo", keywords: ["guerra mundial", "guerra fria", "nazismo", "fascismo", "globalização", "revolução russa"] },
      { id: "patrimonio", name: "Memória e patrimônio", keywords: ["memória", "patrimônio", "identidade", "museu", "cultura material", "tradição"] }
    ]
  },
  geografia: {
    name: "Geografia",
    emoji: "🌎",
    area: "human-sciences",
    description: "Cartografia, urbanização, agricultura, clima, globalização, população e meio ambiente.",
    topics: [
      { id: "cartografia", name: "Cartografia", keywords: ["mapa", "escala", "coordenadas", "latitude", "longitude", "projeção", "cartografia"] },
      { id: "urbanizacao", name: "Urbanização", keywords: ["cidade", "urbano", "metrópole", "periferia", "mobilidade", "moradia", "segregação"] },
      { id: "agropecuaria", name: "Agropecuária e campo", keywords: ["agricultura", "agronegócio", "campo", "rural", "latifúndio", "reforma agrária", "plantio"] },
      { id: "clima", name: "Clima e vegetação", keywords: ["clima", "temperatura", "chuva", "bioma", "vegetação", "cerrado", "amazônia", "caatinga"] },
      { id: "meio-ambiente", name: "Meio ambiente", keywords: ["desmatamento", "sustentabilidade", "impacto ambiental", "poluição", "recursos naturais", "conservação"] },
      { id: "populacao", name: "População", keywords: ["população", "migração", "natalidade", "mortalidade", "demografia", "êxodo", "imigração"] },
      { id: "globalizacao", name: "Globalização e economia", keywords: ["globalização", "comércio", "indústria", "transnacional", "bloco econômico", "território", "geopolítica"] }
    ]
  }
};

window.ENEM_AREAS = {
  "natural-sciences": "Ciências da Natureza",
  mathematics: "Matemática",
  languages: "Linguagens",
  "human-sciences": "Ciências Humanas"
};
