import { useEffect } from 'react'
import { useLanguage } from './contexts/LanguageContext'
import { Header } from './components/layout/Header/Header'
import { Footer } from './components/layout/Footer/Footer'
import { Hero } from './components/sections/Hero/Hero'
import { About } from './components/sections/About/About'
import { Experience } from './components/sections/Experience/Experience'
import { Skills } from './components/sections/Skills/Skills'
import { Projects } from './components/sections/Projects/Projects'
import { Publications } from './components/sections/Publications/Publications'
import { Contact } from './components/sections/Contact/Contact'

function App() {
  const { language } = useLanguage()

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language

    // Update document title
    document.title = language === 'pt'
      ? 'Elysson Alves | Desenvolvedor Full Stack & Engenheiro de IA'
      : 'Elysson Alves | Full Stack Developer & AI Engineer'

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      language === 'pt'
        ? 'Portfólio de Elysson Alves, estudante de Sistemas de Informação na UFC e Desenvolvedor Full Stack no NPI. Especialista em IA, Automação e Sistemas Multiagentes.'
        : 'Portfolio of Elysson Alves, Information Systems student at UFC and Full Stack Developer at NPI. Specialist in AI, Automation, and Multi-Agent Systems.'
    )

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute(
      'content',
      language === 'pt'
        ? 'desenvolvedor full stack, engenheiro de ia, sistemas multiagentes, inteligência artificial, react, python, ufc, npi, automação'
        : 'full stack developer, ai engineer, multi-agent systems, artificial intelligence, react, python, ufc, npi, automation'
    )
  }, [language])

  return (
    <div style={{ paddingTop: '80px' }}>
      <Header />
      
      <main className="container">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Publications />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
