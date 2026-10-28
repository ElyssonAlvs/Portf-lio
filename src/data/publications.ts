export interface PublicationItem {
  title: string;
  venue: string | { pt: string; en: string };
  venueFullName: { pt: string; en: string };
  award: { pt: string; en: string } | null;
  url: string | null;
  type: 'workshop' | 'journal' | 'conference' | 'thesis';
  abstract?: { pt: string; en: string };
}

export const publications: PublicationItem[] = [
  {
    title: "Agile Methodology and AI in Multi-Agent Systems: An agent for planning and executing sprints",
    venue: "WESAAC 2025",
    venueFullName: { pt: "Workshop-Escola de Sistemas de Agentes, seus Ambientes e Aplicações — SBBD & BRACIS 2025", en: "Workshop-School of Agent Systems, their Environments and Applications — SBBD & BRACIS 2025" },
    award: { pt: "WESAAC 2025 (SBC) · Top 3", en: "WESAAC 2025 (SBC) · Top 3" },
    url: "https://sol.sbc.org.br/index.php/wesaac/article/view/37543",
    type: "workshop",
    abstract: {
      pt: "Integração de Sistemas Multiagentes (BDI) e LLMs com n8n para planejamento ágil de sprints e critérios BDD.",
      en: "BDI Multi-Agent Systems and LLM integration with n8n for automated agile sprint planning and BDD criteria."
    }
  },
  {
    title: "Metodologia Ágil e IA em Sistemas Multiagentes: Avaliação Experimental de uma Arquitetura para Planejamento e Execução de Sprints",
    venue: "REIC 2025",
    venueFullName: { pt: "Revista Eletrônica de Iniciação Científica em Computação (SBC)", en: "Electronic Journal of Scientific Initiation in Computing (SBC)" },
    award: null,
    url: "https://journals-sol.sbc.org.br/index.php/reic/article/view/7182",
    type: "journal",
    abstract: {
      pt: "Avaliação experimental da arquitetura multiagente com métricas de completude e consistência em backlog.",
      en: "Experimental evaluation of multi-agent architecture with backlog completeness and consistency metrics."
    }
  },
  {
    title: "Gamificação no Ensino da Gerência de Projetos de Software: uma Revisão Sistemática da Literatura",
    venue: "WEI 2025",
    venueFullName: { pt: "Workshop sobre Educação em Computação — CSBC 2025 (45ª Edição)", en: "Workshop on Computing Education — CSBC 2025 (45th Edition)" },
    award: null,
    url: "https://sol.sbc.org.br/index.php/wei/article/view/36187",
    type: "workshop",
    abstract: {
      pt: "Revisão sistemática de literatura analisando dinâmicas e mecânicas no ensino de gerência de software.",
      en: "Systematic literature review analyzing mechanics and dynamics in software management education."
    }
  },
  {
    title: "Acompanhamento de Calouros em Sistemas de Informação: Integração e Suporte no Início da Vida Universitária",
    venue: "WEI 2025",
    venueFullName: { pt: "Workshop sobre Educação em Computação — CSBC 2025 (45ª Edição)", en: "Workshop on Computing Education — CSBC 2025 (45th Edition)" },
    award: null,
    url: "https://sol.sbc.org.br/index.php/wei/article/view/36226",
    type: "workshop",
    abstract: {
      pt: "Análise de estratégias de tutoria acadêmica e acolhimento para retenção de ingressantes em TI.",
      en: "Analysis of academic mentoring strategies and onboarding to improve retention in IT degrees."
    }
  },
  {
    title: "MFUP como Estratégia de Ensino para Ingressantes no Curso de Sistemas de Informação",
    venue: { pt: "Encontros Universitários UFC 2025", en: "UFC University Meetings 2025" },
    venueFullName: { pt: "15ª Edição dos Encontros Universitários da UFC em Quixadá — Dez. 2025", en: "15th Edition of UFC University Meetings in Quixadá — Dec. 2025" },
    award: { pt: "1º Lugar — Melhor Resumo (Best Paper)", en: "1st Place — Best Abstract (Best Paper)" },
    url: null,
    type: "conference",
    abstract: {
      pt: "Metodologia de facilitação participativa aplicada a calouros com premiação de melhor resumo.",
      en: "Participatory facilitation methodology applied to freshmen, awarded Best Abstract paper."
    }
  },
  {
    title: "Mapeamento de Processos e BPM no Contexto do Desenvolvimento de Software: um Mapeamento Sistemático da Literatura",
    venue: { pt: "TCC — UFC", en: "Undergraduate Thesis — UFC" },
    venueFullName: { pt: "Trabalho de Conclusão de Curso — Universidade Federal do Ceará", en: "Undergraduate Thesis — Federal University of Ceará" },
    award: null,
    url: "https://repositorio.ufc.br/handle/riufc/85781",
    type: "thesis",
    abstract: {
      pt: "Mapeamento sistemático de literatura sobre integração de BPM e engenharia de software em organizações.",
      en: "Systematic literature review on the integration of BPM and software engineering in organizations."
    }
  }
];
