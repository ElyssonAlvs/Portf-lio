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
    company: "SpeedMed",
    period: { pt: "Maio 2026 – Presente", en: "May 2026 – Present" },
    description: {
      pt: "Desenvolvimento e sustentação do backend da plataforma SpeedMed (SaaS para gestão de clínicas e consultórios médicos). Concepção de APIs REST escaláveis com NestJS, modelagem e otimização relacional com PostgreSQL e Prisma ORM. Implementação de autenticação JWT, validação de esquemas com Zod, testes automatizados e arquitetura monorepo com Turborepo e Docker. Gestão de deploy contínuo com Feature Flags via Unleash.",
      en: "Backend development and maintenance for the SpeedMed platform (SaaS for healthcare and clinic management). Building scalable REST APIs with NestJS, relational data modeling and optimization with PostgreSQL and Prisma ORM. Implementing JWT authentication, Zod schema validation, automated test suites, and monorepo architecture using Turborepo and Docker. Continuous feature management using Feature Flags via Unleash."
    },
    tags: ["NestJS", "TypeScript", "PostgreSQL", "Prisma ORM", "Docker", "Turborepo", "Unleash", "Zod", "JWT"]
  },
  {
    role: { pt: "Desenvolvedor de Software (Full Stack / Backend)", en: "Software Developer (Full Stack / Backend)" },
    company: "Universidade Federal do Ceará (UFC)",
    period: { pt: "Set 2025 – Jul 2026", en: "Sep 2025 – Jul 2026" },
    description: {
      pt: "Desenvolvimento do sistema de prontuário eletrônico odontológico e plataforma de gestão do Plano de Desenvolvimento Institucional (PDI). Modelagem de banco de dados, construção de microsserviços e endpoints REST, integração com interfaces React e aplicação de cerimônias ágeis Scrum com validação direta de stakeholders.",
      en: "Development of the electronic dental records system and institutional development management platform (PDI). Relational database modeling, REST endpoint development, frontend integration with React, and active participation in Scrum agile ceremonies with direct stakeholder validation."
    },
    tags: ["Backend", "PostgreSQL", "React", "TypeScript", "APIs REST", "Scrum"]
  },
  {
    role: { pt: "Gerente de Projetos, Finanças & Bolsista", en: "Project & Finance Manager, Scholar" },
    company: "PET-SI UFC Quixadá",
    period: { pt: "Mar 2024 – Ago 2026", en: "Mar 2024 – Aug 2026" },
    description: {
      pt: "Atuação multifuncional no Programa de Educação Tutorial em Sistemas de Informação. Coordenação ágil de equipes em projetos de pesquisa e extensão, controle orçamentário e fluxo financeiro semestral, além de liderança em publicações científicas premiadas na área de sistemas multiagentes e engenharia de software.",
      en: "Multifunctional leadership in the Tutorial Education Program (Information Systems). Agile project management across research and extension initiatives, semiannual budget planning and cash flow control, and authoring award-winning academic papers in multi-agent systems and software engineering."
    },
    tags: [{ pt: "Gestão Ágil", en: "Agile Management" }, { pt: "Finanças", en: "Finance" }, { pt: "Pesquisa & Extensão", en: "Research & Extension" }, "Liderança", "ClickUp"]
  },
  {
    role: { pt: "Conselheiro de Governança", en: "Governance Board Member" },
    company: "Avante Tech Jr.",
    period: { pt: "Jan 2025 – Dez 2025", en: "Jan 2025 – Dec 2025" },
    description: {
      pt: "Atuação no Conselho Estratégico da empresa júnior de tecnologia. Avaliação de conformidade estatutária, compliance, emissão de pareceres de governança, análise de riscos corporativos e mentoria estratégica às diretorias operacionais.",
      en: "Board member at the collegiate corporate governance body of the student tech enterprise. Oversight of statutory compliance, issuing governance opinions, strategic risk assessment, and guiding organizational leadership."
    },
    tags: [{ pt: "Governança Corporativa", en: "Corporate Governance" }, "Compliance", { pt: "Gestão de Riscos", en: "Risk Management" }, { pt: "Estratégia", en: "Strategy" }]
  }
];
