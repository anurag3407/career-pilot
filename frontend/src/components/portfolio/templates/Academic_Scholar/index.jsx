import React from "react";
import data from "../../../../data/dummy_data.json";

import Hero from "./Hero";
import About from "./About";
import Stats from "./Stats";
import SectionDivider from "./SectionDivider";

const AcademicScholar = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 overflow-x-hidden">
      <Hero data={data} />

      <SectionDivider />

      <About data={data} />

      <Stats data={data} />

      <SectionDivider />
    </div>
  );
};

export default AcademicScholar;