export interface Project {
  name: string;
  description: { pt: string; en: string };
  tags: (string | { pt: string; en: string })[];
  url: string;
}

export const projects: Project[] = [
  {
    name: "FinanceBOT",
    description: { pt: "Bot de análise e controle financeiro automatizado.", en: "Automated financial analysis and control bot." },
    tags: ["Python", { pt: "Bot", en: "Bot" }, { pt: "Automação", en: "Automation" }],
    url: "https://github.com/ElyssonAlvs/FinanceBOT"
  },
  {
    name: "TaskAgent",
    description: { pt: "Agente de IA para planejamento e execução de tarefas.", en: "AI agent for task planning and execution." },
    tags: ["Python", { pt: "IA", en: "AI" }, { pt: "Agentes LLM", en: "LLM Agents" }],
    url: "https://github.com/ElyssonAlvs/TaskAgent"
  },
  {
    name: "fast-api-manager",
    description: { pt: "Gerenciador de APIs construído com FastAPI.", en: "API manager built with FastAPI." },
    tags: ["FastAPI", "Python", "REST"],
    url: "https://github.com/ElyssonAlvs/fast-api-manager"
  },
  {
    name: "Stock_FASTAPI",
    description: { pt: "Sistema de controle de estoque com FastAPI e banco de dados.", en: "Stock control system built with FastAPI and a relational database." },
    tags: ["FastAPI", "Python", "PostgreSQL"],
    url: "https://github.com/ElyssonAlvs/Stock_FASTAPI"
  },
  {
    name: "Mineração de Dados",
    description: { pt: "Projeto acadêmico de análise e mineração de dados com Python.", en: "Academic data mining and analysis project using Python." },
    tags: ["Python", { pt: "Mineração de Dados", en: "Data Mining" }, "Pandas"],
    url: "https://github.com/ElyssonAlvs/Mineracao-de-Dados"
  },
  {
    name: "dslist",
    description: { pt: "API REST de lista de jogos construída com Java e Spring Boot.", en: "REST API for a game list built with Java and Spring Boot." },
    tags: ["Java", "Spring Boot", "REST"],
    url: "https://github.com/ElyssonAlvs/dslist"
  }
]

