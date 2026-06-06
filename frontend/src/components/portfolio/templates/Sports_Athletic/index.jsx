import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import TrophyCabinet from "./TrophyCabinet";
import ResumeCTA from "./ResumeCTA";
import Contact from "./Contact";

export default function SportsAthletic() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <About />
      <Projects />
      <TrophyCabinet />
      <ResumeCTA />
      <Contact />
    </div>
  );
}
