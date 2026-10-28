export interface SkillCategory {
  category: { pt: string; en: string };
  items: (string | { pt: string; en: string })[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: { pt: "Backend & APIs", en: "Backend & APIs" },
    items: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "Python",
      "FastAPI",
      "Java (Spring Boot)",
      { pt: "APIs RESTful", en: "RESTful APIs" },
      "Webhooks",
      { pt: "Contratos OpenAPI", en: "OpenAPI Contracts" },
      "Clean Code"
    ]
  },
  {
    category: { pt: "Bancos de Dados & Infraestrutura", en: "Databases & Infrastructure" },
    items: [
      "PostgreSQL",
      "MySQL",
      "Prisma ORM",
      { pt: "Redis (Caching & Filas)", en: "Redis (Caching & Queues)" },
      "Docker",
      "Docker Compose",
      "Linux",
      "Git / GitHub Flow"
    ]
  },
  {
    category: { pt: "Engenharia de IA & Agentes", en: "AI Engineering & Agents" },
    items: [
      "LangGraph",
      "Model Context Protocol (MCP)",
      { pt: "Agentes Autônomos (BDI, CrewAI)", en: "Autonomous Agents (BDI, CrewAI)" },
      "RAG (ChromaDB, LangChain)",
      "Prompt Engineering",
      "LLMs (OpenAI, Claude, Groq, Ollama)"
    ]
  },
  {
    category: { pt: "Testes & Metodologias", en: "Testing & Methodologies" },
    items: [
      { pt: "Testes Unitários & E2E (Jest, Pytest)", en: "Unit & E2E Testing (Jest, Pytest)" },
      "Feature Flags (Unleash)",
      "Scrum",
      { pt: "Modelagem BPM", en: "BPM Modeling" },
      "LGPD"
    ]
  }
];
