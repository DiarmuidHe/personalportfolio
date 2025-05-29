import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Slider from 'react-slick';
import { Link, Element } from "react-scroll";
import { useState, useEffect } from 'react';
function App() 
{
  const [activeSection, setActiveSection] = useState('Home');
  const settings = {
  infinite: true,
  speed: 500,
  arrows: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: true,

  centerPadding: "60px",
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adjust offset as needed
      
      // Get all sections and their positions
      const sections = ['Home', 'projects', 'achievements'].map(section => {
        const element = document.getElementById(section);
        return {
          id: section,
          offsetTop: element?.offsetTop || 0,
          offsetHeight: element?.offsetHeight || 0
        };
      });

      // Find which section is currently active
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
      <Element name="Home" id="Home">
        <main className="d-flex justify-content-center align-items-center vh-100">
          <h2>Hello, I am <span style={{color: 'rgb(59, 152, 219)'}}>Diarmuid</span>.</h2>
        </main>
      </Element>
      
      <nav className="navbar navbar-expand navbar-light bg-light sticky-top">
        <div className="container-fluid justify-content-center">
          <div id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item mx-3">
                <Link 
                  to="Home" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'Home' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link 
                  to="projects" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'projects' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  Projects
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link 
                  to="achievements" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'achievements' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  Achievements
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Element name="projects" id="projects">
        <main>
          <div style={{ height: '100vh', paddingTop: '56px' }}>
            <div class="container">
              

              <h2>Projects</h2>
                <div className="slider-container">
                  <Slider {...settings}>
                    <div>
                      <h3>1</h3>
                    </div>
                    <div>
                      <h3>2</h3>
                    </div>
                    <div>
                      <h3>3</h3>
                    </div>
                    <div>
                      <h3>4</h3>
                    </div>
                    <div>
                      <h3>5</h3>
                    </div>
                    <div>
                      <h3>6</h3>
                    </div>
                  </Slider>
                </div>
              </div>
          </div>
        </main>
        
      </Element>
      
      <Element name="achievements" id="achievements">
        <div style={{ height: '100vh', paddingTop: '56px' }}>
          <h2>Achievements</h2>
        </div>
      </Element>
    </div>
  );
}
export default App;