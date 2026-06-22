import data from "../../../../data/dummy_data.json";
import Background   from "./Background";
import Hero         from "./Hero";
import Marquee      from "./Marquee";
import About        from "./About";
import Skills       from "./Skills";
import Projects     from "./Projects";
import Experience   from "./Experience";
import Testimonials from "./Testimonials";
import Contact      from "./Contact";
import Footer       from "./Footer";

const marqueeTags = [
  ...(data.skills?.slice(0, 6).map(s => s.name) || []),
  "Open to work",
  "Design + Code",
  "Based globally",
];

export default function DribbbleShotsPortfolio() {
  return (
    <div
      className="min-h-screen bg-white text-[#1a1a1a]"
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      <Background />
      <Hero />
      <Marquee texts={marqueeTags} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}