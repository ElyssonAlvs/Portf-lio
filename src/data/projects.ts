export interface Project {
  name: string;
  description: { pt: string; en: string };
  tags: (string | { pt: string; en: string })[];
  url: string;
}

export const projects: Project[] = [
  {
    name: "FinanceBOT",
    description: {
      pt: "Assistente financeiro pessoal integrado ao Telegram que automatiza o registro, categorização e gerenciamento de gastos via linguagem natural, utilizando IA (Groq/Llama 3.3), RAG para consultas e n8n.",
      en: "Smart personal finance assistant integrated with Telegram that automates expense logging, categorization, and query via natural language, using LLMs (Groq/Llama 3.3), RAG, and n8n."
    },
    tags: ["Python", { pt: "Bot", en: "Bot" }, { pt: "Automação", en: "Automation" }],
    url: "https://github.com/ElyssonAlvs/FinanceBOT"
  },
  {
    name: "TaskAgent",
    description: {
      pt: "Agente de IA leve integrado a uma API FastAPI para gerenciamento de tarefas, permitindo realizar operações de CRUD e consultas em linguagem natural via LLMs locais (Ollama).",
      en: "Lightweight AI agent integrated with a FastAPI task manager API, enabling task CRUD operations using natural language through local LLMs via Ollama."
    },
    tags: ["Python", { pt: "IA", en: "AI" }, { pt: "Agentes LLM", en: "LLM Agents" }],
    url: "https://github.com/ElyssonAlvs/TaskAgent"
  },
  {
    name: "fastapi-task-manager",
    description: {
      pt: "API RESTful de gerenciamento de tarefas desenvolvida com FastAPI, fornecendo recursos completos de CRUD, filtros avançados e paginação.",
      en: "RESTful task manager API built with FastAPI, featuring complete CRUD operations, query filtering, and pagination support."
    },
    tags: ["FastAPI", "Python", "REST"],
    url: "https://github.com/ElyssonAlvs/fastapi-task-manager"
  },
  {
    name: "Stock_FASTAPI",
    description: {
      pt: "API de gerenciamento de estoque moderna e escalável desenvolvida com FastAPI e PostgreSQL, incluindo suporte a migrações com Alembic, autenticação JWT, operações em lote e Docker.",
      en: "Modern and scalable inventory management API built with FastAPI, PostgreSQL, and Alembic, featuring JWT authentication, batch operations, and Docker support."
    },
    tags: ["FastAPI", "Python", "PostgreSQL"],
    url: "https://github.com/ElyssonAlvs/Stock_FASTAPI"
  },
  {
    name: "Mineração de Dados",
    description: {
      pt: "Projetos práticos e análises da disciplina de Mineração de Dados (UFC) focados em pré-processamento, classificação, agrupamento e visualização de dados utilizando Python, Pandas e scikit-learn.",
      en: "Practical projects and datasets analysis for the Data Mining course (UFC), focusing on data preprocessing, classification, clustering, and visualization using Python, Pandas, and scikit-learn."
    },
    tags: ["Python", { pt: "Mineração de Dados", en: "Data Mining" }, "Pandas"],
    url: "https://github.com/ElyssonAlvs/Mineracao_de_Dados"
  },
  {
    name: "dslist",
    description: {
      pt: "API REST para listagem e ranqueamento de jogos desenvolvida em Java com Spring Boot, construída durante o Intensivão Java Spring (Nelio Alves).",
      en: "REST API for listing and ranking games built with Java and Spring Boot, developed during the Java Spring Intensive course by Nelio Alves."
    },
    tags: ["Java", "Spring Boot", "REST"],
    url: "https://github.com/ElyssonAlvs/dslist"
  }
]


