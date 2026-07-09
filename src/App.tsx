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
