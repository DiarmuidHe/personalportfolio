import { Element } from "react-scroll";


const HomeSection = () => {
  return (
    <Element name="Home" id="Home">
      <main className="d-flex justify-content-center align-items-center vh-100">
        <h2>Hello, I am <span style={{color: 'rgb(59, 152, 219)'}}>Diarmuid</span>.</h2>
      </main>
    </Element>
  );
};

export default HomeSection;