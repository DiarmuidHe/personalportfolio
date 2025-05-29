import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useState, useEffect } from 'react';
import Navigation from "./components/Navigation/Navigation";
import HomeSection from "./components/Home/Home";
import AchievementsSection from "./components/Achievement/Achievement";
import ProjectsSection from "./components/Project/Project";
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = ['Home', 'projects', 'achievements'].map(section => {
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
    <div>
      <HomeSection />
      <Navigation activeSection={activeSection} />
      <ProjectsSection />
      <AchievementsSection />
    </div>
  );
}

export default App;