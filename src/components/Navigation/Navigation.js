import { Link } from "react-scroll";


const Navigation = ({ activeSection }) => {
  return (
    <div className="container sticky-top">
      <nav className="navbar navbar-expand navbar-light bg-light rounded-3 ">
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
    </div>
  );
};

export default Navigation;