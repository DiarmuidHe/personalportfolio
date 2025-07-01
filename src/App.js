import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useState, useEffect } from 'react';
import Navigation from "./components/Navigation/Navigation";
import HomeSection from "./components/HomeSection/Home";
import AchievementsSection from "./components/AchievementSection/Achievement";
import ProjectsSection from "./components/ProjectSection/Project";
import ContactSection from "./components/ContactSection/Contact";
import FooterSection from "./components/FooterSection/footer";
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = ['Home', 'projects', 'achievements', 'contact'].map(section => {
        const element = document.getElementById(section);
        return {
          id: section,
          offsetTop: element?.offsetTop || 0,
          offsetHeight: element?.offsetHeight || 0
        };
      });

      const currentSection = sections.find(section => 
        scrollPosition >= section.offsetTop && 
        scrollPosition < section.offsetTop + section.offsetHeight
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="background">
      
      <Navigation activeSection={activeSection} />
      <div style={{ height: '90vh', overflow:'hidden' }}>
      <button 
      className="position-fixed bottom-0 end-0 p-3 btn rounded-4 me-2 mb-2 d-flex align-items-center gap-2">
        <p className="mb-0">Chat</p>
        <img 
          src="/chatstars.png"
          className="chatBtn"
          alt="a perspective view of a logo of diarmuid hession initials (dh)" 
        />
      </button>

        <HomeSection activeSection={activeSection} />
        
      </div>
      
      <ProjectsSection />
      <AchievementsSection />
      <ContactSection/>
      <FooterSection/>
    </div>
  );
}

export default App;