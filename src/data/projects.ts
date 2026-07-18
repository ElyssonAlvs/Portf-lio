export interface Project {
  name: string;
  description: { pt: string; en: string };
  tags: (string | { pt: string; en: string })[];
  url: string;
  image?: string;
}

export const projects: Project[] = [
  {
    name: "FinanceBOT",
    description: {
      pt: "Assistente financeiro pessoal integrado ao Telegram que automatiza o registro, categorização e gerenciamento de gastos via linguagem natural, utilizando IA (Groq/Llama 3.3), RAG para consultas e n8n.",
      en: "Smart personal finance assistant integrated with Telegram that automates expense logging, categorization, and query via natural language, using LLMs (Groq/Llama 3.3), RAG, and n8n."
    },
    tags: ["Python", { pt: "Bot", en: "Bot" }, { pt: "Automação", en: "Automation" }],
    url: "https://github.com/ElyssonAlvs/FinanceBOT",
    image: "/projects/FinanceBOTV1.jpg"
  },
  {
    name: "TaskAgent",
    description: {
      pt: "Agente de IA leve integrado a uma API FastAPI para gerenciamento de tarefas, permitindo realizar operações de CRUD e consultas em linguagem natural via LLMs locais (Ollama).",
      en: "Lightweight AI agent integrated with a FastAPI task manager API, enabling task CRUD operations using natural language through local LLMs via Ollama."
    },
    tags: ["Python", { pt: "IA", en: "AI" }, { pt: "Agentes LLM", en: "LLM Agents" }],
    url: "https://github.com/ElyssonAlvs/TaskAgent",
    image: "/projects/TaskAgentV2.png"
  },
  {
    name: "Stock_FASTAPI",
    description: {
      pt: "API de gerenciamento de estoque moderna e escalável desenvolvida com FastAPI e PostgreSQL, incluindo suporte a migrações com Alembic, autenticação JWT, operações em lote e Docker.",
      en: "Modern and scalable inventory management API built with FastAPI, PostgreSQL, and Alembic, featuring JWT authentication, batch operations, and Docker support."
    },
    tags: ["FastAPI", "Python", "PostgreSQL", "Docker", "JWT"],
    url: "https://github.com/ElyssonAlvs/Stock_FASTAPI"
  },
  {
    name: "FastAPI Task Manager",
    description: {
      pt: "API RESTful de gerenciamento de tarefas desenvolvida com FastAPI, fornecendo recursos completos de CRUD, filtros avançados e paginação.",
      en: "RESTful task manager API built with FastAPI, featuring complete CRUD operations, query filtering, and pagination support."
    },
    tags: ["FastAPI", "Python", "REST"],
    url: "https://github.com/ElyssonAlvs/fastapi-task-manager"
  }
];

