import { NavBar } from "./NavBar";
import { HeroSection } from "./HeroSection";
import { OperatorProfile } from "./OperatorProfile";
import { Arsenal } from "./Arsenal";
import { MissionTimeline } from "./MissionTimeline";
import { Operations } from "./Operations";
import { Testimonials } from "./Credentials";
import { SecureChannel } from "./SecureChannel";
import { Footer } from "./Footer";

export default function App() {
  return (
    <div
      style={{
        background: "#050505",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        section + section { border-top: 1px solid #1A1A1A; }
        footer { border-top: 1px solid #1A1A1A; }
        ::placeholder { color: #333 !important; }
      `}</style>

      <NavBar />
      <HeroSection />
      <OperatorProfile />
      <Arsenal />
      <MissionTimeline />
      <Operations />
      <Testimonials />
      <SecureChannel />
      <Footer />
    </div>
  );
}