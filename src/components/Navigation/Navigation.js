import { Link } from "react-scroll";
import './Navigation.css'

const Navigation = ({ activeSection }) => {
  return (
    <div className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded-3 mb-3">
        <div className="container-fluid">
          {/* Brand/logo - removed collapse triggers from this */}
          <Link 
            to="Home" 
            smooth={true} 
            duration={250} 
            className={`fw-bold navbar-brand ${activeSection === 'Home' ? 'active fw-bold' : ''}`}
            style={{ cursor: "pointer" }}
          >
            <img src="/Logo.png" alt="a prespective view of a logo of diarmuid hession initials (dh)" className="navLogo" />
          </Link>
          
          {/* Toggler button */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link 
                  to="Home" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'Home' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="projects" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'projects' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                >
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="achievements" 
                  smooth={true} 
                  duration={250} 
                  className={`nav-link ${activeSection === 'achievements' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                >
                  Achievements
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                    to="contact"
                    smooth={true}
                    duration={250}
                    className={`nav-link ${activeSection === 'contact' ? 'active fw-bold' : ''}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;