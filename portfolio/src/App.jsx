import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { fireCornersConfetti } from './utils/confetti';

function App() {
  useEffect(() => {
    // Small delay so the page paints first, then celebrate
    const id = setTimeout(fireCornersConfetti, 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <Navbar />
      <div id="floating-container">
        <Hero />
        <About />
        <Education />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
