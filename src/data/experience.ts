export interface Experience {
  role: { pt: string; en: string };
  company: string;
  period: { pt: string; en: string };
  description: { pt: string; en: string };
  tags: (string | { pt: string; en: string })[];
}

export const experiences: Experience[] = [
  {
    role: { pt: "Desenvolvedor Backend", en: "Backend Developer" },
    company: "SpeeedMed",
    period: { pt: "Maio 2026 – Atual", en: "May 2026 – Present" },
    description: { 
      pt: "Desenvolvimento do backend da plataforma SaaS SpeedMed para gestão de clínicas. Implementação de APIs REST com NestJS, Prisma ORM e PostgreSQL. Atuação em arquitetura monorepo com Turborepo, Docker e testes automatizados.", 
      en: "Backend development for the SpeedMed SaaS clinic management platform. Implementation of REST APIs with NestJS, Prisma ORM, and PostgreSQL. Monorepo architecture with Turborepo, Docker, and automated testing." 
    },
    tags: ["NestJS", "Prisma", "PostgreSQL", "Docker", "Turborepo"]
  },
  {
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    company: "Universidade Federal do Ceará",
    period: { pt: "Set 2025 – Jul 2026", en: "Sep 2025 – Jul 2026" },
    description: { 
      pt: "Desenvolvimento de prontuário eletrônico odontológico e de uma plataforma para o PDI utilizando metodologia Scrum. Integração backend/frontend, modelagem de entidades e alinhamento direto com stakeholders.", 
      en: "Development of an electronic dental record system and a platform for the IDP (Institutional Development Plan) using Scrum methodology. Backend/frontend integration, entity modeling, and direct alignment with stakeholders." 
    },
    tags: ["React", "Scrum", { pt: "Backend", en: "Backend" }, "SQL"]
  },
  {
    role: { pt: "Gerente de Projetos", en: "Project Manager" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Ago 2025 – Atual", en: "Aug 2025 – Present" },
    description: { 
      pt: "Gestão de projetos educacionais, de pesquisa e extensão. Coordenação de bolsistas, reuniões semanais e uso de ferramentas ágeis.", 
      en: "Management of educational, research, and extension projects. Coordination of scholarship holders, weekly meetings, and use of agile tools." 
    },
    tags: [{ pt: "Gestão Ágil", en: "Agile Management" }, { pt: "Liderança", en: "Leadership" }, "ClickUp"]
  },
  {
    role: { pt: "Conselheiro", en: "Counselor" },
    company: "Avante Tech Jr.",
    period: { pt: "Jan 2025 – Dez 2025", en: "Jan 2025 – Dec 2025" },
    description: { 
      pt: "Governança corporativa e compliance. Emissão de pareceres, análise de riscos e apoio estratégico à tomada de decisão.", 
      en: "Corporate governance and compliance. Issuance of opinions, risk analysis, and strategic support for decision-making." 
    },
    tags: [{ pt: "Governança", en: "Governance" }, "Compliance", { pt: "Análise de Riscos", en: "Risk Analysis" }]
  },
  {
    role: { pt: "Gerente de Finanças", en: "Finance Manager" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Nov 2024 – Ago 2025", en: "Nov 2024 – Aug 2025" },
    description: { 
      pt: "Controle e planejamento do fluxo de caixa. Elaboração de balanços semestrais para decisões estratégicas.", 
      en: "Cash flow control and planning. Preparation of semi-annual balance sheets for strategic decisions." 
    },
    tags: [{ pt: "Finanças", en: "Finance" }, "Google Sheets", { pt: "Planejamento", en: "Planning" }]
  },
  {
    role: { pt: "Bolsista", en: "Scholarship Holder" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Mar 2024 – Atual", en: "Mar 2024 – Present" },
    description: { 
      pt: "Atuação no Programa de Educação Tutorial (PET), contribuindo com atividades de Ensino, Pesquisa e Extensão com foco em interdisciplinaridade e aprendizagem cooperativa.", 
      en: "Participation in the Tutorial Education Program (PET), contributing to Teaching, Research, and Extension activities focused on interdisciplinarity and cooperative learning." 
    },
    tags: [{ pt: "Pesquisa", en: "Research" }, { pt: "Extensão", en: "Extension" }, { pt: "Ensino", en: "Teaching" }]
  }
]
