import Hero from "../Components/Hero";
import About from "../Components/About";
import Pricing from "../Components/Pricing";


const Home = ({ session }) => {
  return (
    <div>
      <Hero />
      <About />
      <Pricing session={session} />
    </div>
  );
};

export default Home;