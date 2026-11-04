import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useLanguage } from './contexts/LanguageContext'
import { Header } from './components/layout/Header/Header'
import { Footer } from './components/layout/Footer/Footer'
import { Hero } from './components/sections/Hero/Hero'
import { Projects } from './components/sections/Projects/Projects'
import { Experience } from './components/sections/Experience/Experience'
import { Skills } from './components/sections/Skills/Skills'
import { Publications } from './components/sections/Publications/Publications'
import { Contact } from './components/sections/Contact/Contact'
import { ProjectDetail } from './pages/ProjectDetail/ProjectDetail'
import { ChatWidget } from './components/chat/ChatWidget'

interface HomeProps {
  setActiveTab: (tab: string) => void
}

function HomePage({ setActiveTab }: HomeProps) {
  useEffect(() => {
    const sectionIds = [
      { id: 'hero', tab: 'home' },
      { id: 'projects', tab: 'projects' },
      { id: 'experience', tab: 'experience' },
      { id: 'skills', tab: 'skills' },
      { id: 'publications', tab: 'publications' },
      { id: 'contact', tab: 'contact' }
    ]

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveTab('home')
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = sectionIds.find((s) => s.id === entry.target.id)
            if (found) {
              setActiveTab(found.tab)
            }
          }
        })
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.1
      }
    )

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [setActiveTab])

  return (
    <div className="space-y-12 md:space-y-14">
      <Hero setActiveTab={setActiveTab} />
      <Projects />
      <Experience />
      <Skills />
      <Publications />
      <Contact />
    </div>
  )
}

function App() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState('home')
  const location = useLocation()

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language

    if (location.pathname === '/') {
      document.title = language === 'pt'
        ? 'Elysson Alves | Engenheiro de Software · Backend & IA'
        : 'Elysson Alves | Software Engineer · Backend & AI'
    }

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
        ? 'Bacharel em Sistemas de Informação pela UFC e Desenvolvedor Backend na SpeedMed. Especialista em APIs REST escaláveis, microsserviços, Docker, PostgreSQL e Agentes Autônomos de IA (LangGraph, MCP, RAG).'
        : 'Bachelor of Information Systems from UFC and Backend Developer at SpeedMed. Specialist in scalable REST APIs, microservices, Docker, PostgreSQL, and Autonomous AI Agents (LangGraph, MCP, RAG).'
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
        ? 'Desenvolvedor Backend, Engenheiro de IA, Python, FastAPI, TypeScript, NestJS, LangGraph, MCP, PostgreSQL, Docker, Redis, Elysson Alves'
        : 'Backend Developer, AI Engineer, Python, FastAPI, TypeScript, NestJS, LangGraph, MCP, PostgreSQL, Docker, Redis, Elysson Alves'
    )
  }, [language, location.pathname])

  return (
    <div style={{ paddingTop: '56px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container flex-grow py-6 md:py-10">
        <Routes>
          <Route path="/" element={<HomePage setActiveTab={setActiveTab} />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Assistente Profissional Factual com IA */}
      <ChatWidget />
    </div>
  )
}

export default App
