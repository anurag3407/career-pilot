

// Import all boarding pass components
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';

export default function BoardingPass() {


  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-900 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Repeating background pattern to look like security paper */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12 py-12 md:py-24">
        <Hero personal={data.personal} />
        <About personal={data.personal} socials={data.socials} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experience={data.experience} />
        <Testimonials testimonials={data.testimonials} />
      </div>

      {/* Footer / End of Pass */}
      <footer className="relative z-10 text-center py-12 border-t-2 border-dashed border-stone-300 mx-4 max-w-5xl md:mx-auto">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Thank you for flying with</p>
        <p className="font-black text-stone-800 text-xl tracking-tighter uppercase">{data.personal.name}</p>
        <div className="mt-6 flex justify-center opacity-30 mix-blend-multiply">
           {/* Footer Barcode */}
           <div className="h-8 flex items-center gap-[2px]">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-full bg-stone-800" 
                  style={{ width: `${Math.random() * 4 + 1}px` }}
                />
              ))}
            </div>
        </div>
      </footer>
    </div>
  );
}
