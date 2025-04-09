import '../lib/styles.css'
import Navbar from '../components/ui/Navbar'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ExperienceSection from '../components/sections/ExperienceSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import SkillsSection from '../components/sections/SkillsSection'
import GitHubActivitySection from '../components/sections/GitHubActivitySection'
import ContactSection from '../components/sections/ContactSection'
import Footer from '../components/ui/Footer'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col'>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <GitHubActivitySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
