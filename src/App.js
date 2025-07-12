// App.js
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
import ChatOverlay from "./components/ChatSection/Chat"; // ✅ Make sure import is correct
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
      
      <ChatOverlay /> 

      <HomeSection activeSection={activeSection} />
      <ProjectsSection />
      <AchievementsSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}

export default App;
