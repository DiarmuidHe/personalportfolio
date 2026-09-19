// App.js
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import Navigation from "./components/Navigation/Navigation";
import HomeSection from "./components/HomeSection/Home";
import AchievementsSection from "./components/AchievementSection/Achievement";
import AboutSection from "./components/AboutSection/About";
import ExperienceSection from "./components/ExperienceSection/Experience";
import EducationSection from "./components/EducationSection/Education";
import ProjectsSection from "./components/ProjectSection/Project";
import ContactSection from "./components/ContactSection/Contact";
import FooterSection from "./components/FooterSection/footer";
import ChatOverlay from "./components/ChatSection/Chat";   // floating chat
import FullPageChat from "./components/FullPageChatSection/FullPageChat";// full page chat
import WeatherTracker from "./components/WeatherTracker/Weather";
import CVPage from "./components/CVPage/CVPage";
import NotFound from "./components/NotFound/NotFound";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import { CHAT_NAVIGATE_EVENT } from "./components/ChatSection/chatEvents";
import './App.css';

function MainPage() {
  const [activeSection, setActiveSection] = useState('Home');
  // Technology picked in Tools & Technologies; the projects grid shows only what uses it
  const [techFilter, setTechFilter] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      const sections = ['Home', 'about', 'experience', 'education', 'projects', 'contact'].map(section => {
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

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navigation activeSection={activeSection} />
      <ChatOverlay /> 
      <CommandPalette />
      <HomeSection activeSection={activeSection} />
      <AboutSection/>
      <ExperienceSection />
      <EducationSection />
      <AchievementsSection techFilter={techFilter} onTechFilter={setTechFilter} />
      <ProjectsSection techFilter={techFilter} onTechFilter={setTechFilter} />
      <ContactSection />
      <FooterSection />
    </>
  );
}

// Short cross-fade between pages. /projects/... stays on the main page (it only opens a dialog),
// so it shares the main page's key and doesn't remount anything.
function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageKey = location.pathname === "/" || location.pathname.startsWith("/projects/") ? "main" : location.pathname;

  // Links in chat answers (e.g. a project write-up) open in place
  useEffect(() => {
    const onNavigate = (e) => navigate(e.detail.path);
    window.addEventListener(CHAT_NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(CHAT_NAVIGATE_EVENT, onNavigate);
  }, [navigate]);

  // New pages start at the top
  useEffect(() => {
    if (pageKey !== "main") window.scrollTo(0, 0);
  }, [pageKey]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={pageKey}>
        {/* Main page. Project write-ups open over it as a dialog, with their own shareable URL */}
        <Route path="/" element={<Page><MainPage /></Page>}>
          <Route path="projects/:slug" element={null} />
        </Route>

        {/* Weather page */}
        <Route path="/weather" element={<Page><WeatherTracker /></Page>} />

        {/* Full Page Chat page */}
        <Route path="/chat" element={<Page><FullPageChat /></Page>} />

        {/* CV page */}
        <Route path="/cv" element={<Page><CVPage /></Page>} />

        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <Router>
      <div className="background">
        <AnimatedRoutes />
      </div>
    </Router>
    </MotionConfig>
  );
}

export default App;
