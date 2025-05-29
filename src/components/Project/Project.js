import { Element } from "react-scroll";
import Slider from 'react-slick';


const ProjectsSection = () => {
  const settings = {
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
  };

  return (
    <Element name="projects" id="projects">
      <main>
        <div style={{ height: '100vh', paddingTop: '56px' }}>
          <div className="container">
            <h2>Projects</h2>
            <div className="slider-container">
              <Slider {...settings}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <div key={item}>
                    <h3>{item}</h3>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </main>
    </Element>
  );
};

export default ProjectsSection;