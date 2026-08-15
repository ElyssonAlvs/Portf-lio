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
      pt: "Desenvolvimento e manutenção do backend da plataforma SpeedMed, sistema SaaS para gestão de clínicas e consultórios médicos. Implementação de APIs REST e novas funcionalidades com NestJS, Prisma ORM e PostgreSQL. Desenvolvimento de autenticação com JWT e validação de dados com Zod. Implementação de testes automatizados para garantir a qualidade e confiabilidade da aplicação. Atuação em arquitetura monorepo com pnpm, Turborepo, Docker e Docker Compose. Utilização de Feature Flags com Unleash e colaboração em revisões de código e boas práticas de desenvolvimento.", 
      en: "Backend development and maintenance for the SpeedMed platform, a SaaS system for clinic and medical office management. REST API implementation and new features using NestJS, Prisma ORM, and PostgreSQL. Authentication development with JWT and data validation with Zod. Automated test implementation to ensure application quality and reliability. Monorepo architecture with pnpm, Turborepo, Docker, and Docker Compose. Use of Feature Flags with Unleash and collaboration on code reviews and development best practices." 
    },
    tags: ["NestJS", "Prisma", "PostgreSQL", "Docker", "Turborepo", "Unleash", "pnpm", "Zod", "JWT"]
  },
  {
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    company: "Universidade Federal do Ceará",
    period: { pt: "Set 2025 – Jul 2026", en: "Sep 2025 – Jul 2026" },
    description: { 
      pt: "Desenvolvimento de prontuário eletrônico odontológico e de uma plataforma para o PDI utilizando metodologia Scrum. Integração backend/frontend, modelagem de entidades, planejamento e construção de telas funcionais e alinhamento direto com stakeholders para validação de entregas.", 
      en: "Development of an electronic dental record system and a platform for the IDP (Institutional Development Plan) using Scrum methodology. Backend/frontend integration, entity modeling, planning and construction of functional screens, and direct alignment with stakeholders for delivery validation." 
    },
    tags: ["React", "Scrum", { pt: "Backend", en: "Backend" }, "SQL"]
  },
  {
    role: { pt: "Gerente de Projetos", en: "Project Manager" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Ago 2025 – Ago 2026", en: "Aug 2025 – Aug 2026" },
    description: { 
      pt: "Gestão de projetos educacionais, de pesquisa e extensão. Coordenação de bolsistas, reuniões semanais e uso de ferramentas ágeis.", 
      en: "Management of educational, research, and extension projects. Coordination of scholarship holders, weekly meetings, and use of agile tools." 
    },
    tags: [{ pt: "Gestão Ágil", en: "Agile Management" }, { pt: "Liderança", en: "Leadership" }, "ClickUp"]
  },
  {
    role: { pt: "Bolsista", en: "Scholarship Holder" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Mar 2024 – Ago 2026", en: "Mar 2024 – Aug 2026" },
    description: { 
      pt: "Atuação no Programa de Educação Tutorial (PET), contribuindo com atividades de Ensino, Pesquisa e Extensão com foco em interdisciplinaridade e aprendizagem cooperativa.", 
      en: "Participation in the Tutorial Education Program (PET), contributing to Teaching, Research, and Extension activities focused on interdisciplinarity and cooperative learning." 
    },
    tags: [{ pt: "Pesquisa", en: "Research" }, { pt: "Extensão", en: "Extension" }, { pt: "Ensino", en: "Teaching" }]
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
  }
];
