export interface SkillCategory {
  category: { pt: string; en: string };
  items: (string | { pt: string; en: string })[];
}

export const skillCategories: SkillCategory[] = [
  { 
    category: { pt: "IA & Automação", en: "AI & Automation" }, 
    items: ["RAG", "n8n", "FastAPI", { pt: "IA Prompting", en: "AI Prompting" }, { pt: "Agentes LLM", en: "LLM Agents" }] 
  },
  { 
    category: { pt: "Dados", en: "Data" }, 
    items: ["Power BI", "SQL", "PostgreSQL", "Dashboards"] 
  },
  { 
    category: { pt: "Desenvolvimento", en: "Development" }, 
    items: ["Python", "Java", "React", "TypeScript", "Git"] 
  },
  { 
    category: { pt: "Gestão", en: "Management" }, 
    items: ["Scrum", "ClickUp", "Trello", "Height", "Slack"] 
  }
]

