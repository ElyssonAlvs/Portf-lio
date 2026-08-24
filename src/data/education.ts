export interface Education {
  degree: { pt: string; en: string };
  institution: string;
  period: { pt: string; en: string };
  description?: { pt: string; en: string };
}

export const educationList: Education[] = [
  {
    degree: { pt: "Bacharelado em Sistemas de Informação", en: "Bachelor of Information Systems" },
    institution: "Universidade Federal do Ceará (UFC)",
    period: { pt: "Mar 2022 – Ago 2026", en: "Mar 2022 – Aug 2026" },
    description: {
      pt: "Formação focada em engenharia de software, banco de dados, governança de TI, metodologias ágeis e inteligência artificial.",
      en: "Education focused on software engineering, databases, IT governance, agile methodologies, and artificial intelligence."
    }
  }
];
