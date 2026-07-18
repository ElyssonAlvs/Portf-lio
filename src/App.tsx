import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from './contexts/LanguageContext'
import { Header } from './components/layout/Header/Header'
import { Footer } from './components/layout/Footer/Footer'
import { Hero } from './components/sections/Hero/Hero'
import { Experience } from './components/sections/Experience/Experience'
import { Skills } from './components/sections/Skills/Skills'
import { Projects } from './components/sections/Projects/Projects'
import { Publications } from './components/sections/Publications/Publications'
import { Contact } from './components/sections/Contact/Contact'

function App() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language

    document.title = language === 'pt'
      ? 'Elysson Alves | Desenvolvedor Backend & Full Stack'
      : 'Elysson Alves | Backend & Full Stack Developer'

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
        ? 'Portfólio de Elysson Alves, estudante de Sistemas de Informação na UFC, Desenvolvedor Backend na SpeedMed e Full Stack no NPI. Especialista em IA, Automação e Sistemas Multiagentes.'
        : 'Portfolio of Elysson Alves, Information Systems student at UFC, Backend Developer at SpeedMed and Full Stack at NPI. Specialist in AI, Automation, and Multi-Agent Systems.'
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
        ? 'desenvolvedor backend, desenvolvedor full stack, engenheiro de ia, sistemas multiagentes, inteligência artificial, react, python, nestjs, ufc, automação'
        : 'backend developer, full stack developer, ai engineer, multi-agent systems, artificial intelligence, react, python, nestjs, ufc, automation'
    )
  }, [language])

  return (
    <div style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container flex-grow py-8 md:py-12" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            {activeTab === 'home' && <Hero setActiveTab={setActiveTab} />}
            {activeTab === 'experience' && <Experience />}
            {activeTab === 'skills' && <Skills />}
            {activeTab === 'projects' && <Projects />}
            {activeTab === 'publications' && <Publications />}
            {activeTab === 'contact' && <Contact />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
