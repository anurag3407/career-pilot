const ResumeCTA = () => {
  return (
    <section className="bg-gradient-to-b from-[#3E2723] to-[#2D1B16] py-20 px-6">
      <div className="max-w-5xl mx-auto bg-[#4E342E]/90 backdrop-blur-sm rounded-[32px] p-10 md:p-16 shadow-2xl border border-[#795548] text-center relative overflow-hidden">

        {/* Coffee Glow Effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D2691E]/20 rounded-full blur-3xl"></div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-[#FFF3E0] mb-6 leading-tight">
          Brewed With Passion ☕
        </h2>

        <p className="text-[#D7CCC8] text-lg md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto">
          Discover my journey, creativity, and experience crafted with dedication —
          just like a perfect cup of coffee.
        </p>

       <a
  href="/resume.pdf"
  download
  aria-label="Download Resume"
  className="inline-block bg-[#D2691E] hover:bg-[#BF5B17] hover:scale-105 transition-all duration-300 text-white px-10 py-4 rounded-full text-lg md:text-xl font-semibold shadow-xl"
>
  Download Resume
</a>
      </div>
    </section>
  );
};

export default ResumeCTA;