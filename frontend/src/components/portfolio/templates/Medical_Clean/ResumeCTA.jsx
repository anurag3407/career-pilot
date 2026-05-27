// // import React from 'react';

// // export default function ResumeCTA() {
// //   return (
// //     <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8">
// //       <h2 className="text-2xl font-bold text-gray-500">Medical_Clean Theme - ResumeCTA Section</h2>
// //       <p className="mt-4 text-gray-400">Implementation pending. Open an issue to contribute!</p>
// //     </div>
// //   );
// // }
// import React from "react";
// import { Download, ArrowRight, HeartPulse, FileText } from "lucide-react";

// export default function ResumeCTA() {
//   return (
//     <section className="w-full py-16 px-6 md:px-12 bg-gradient-to-r from-blue-50 via-white to-emerald-50">
      
//       <div className="max-w-5xl mx-auto relative">

//         {/* Glow background effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-blue-100/30 blur-3xl rounded-3xl"></div>

//         {/* Main card */}
//         <div className="relative bg-white/80 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-3xl transition-all duration-300">

//           {/* Left Side */}
//           <div className="flex-1">
            
//             <div className="flex items-center gap-2 text-emerald-600 mb-3">
//               <HeartPulse className="w-5 h-5 animate-pulse" />
//               <span className="text-xs md:text-sm font-semibold uppercase tracking-widest">
//                 Medical Resume Builder
//               </span>
//             </div>

//             <h2 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
//               Build a Clean & Professional Healthcare Resume
//             </h2>

//             <p className="mt-4 text-gray-600 leading-relaxed">
//               Create ATS-friendly resumes for doctors, nurses, and healthcare professionals.
//               Showcase your skills, certifications, and experience with a modern medical design system.
//             </p>

//             {/* small highlight */}
//             <div className="mt-5 flex items-center gap-2 text-sm text-emerald-600">
//               <FileText className="w-4 h-4" />
//               <span>Optimized for ATS • Clean Design • Fast Export</span>
//             </div>

//           </div>

//           {/* Right Side Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4">

//             <button className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105">
//               <Download className="w-4 h-4 group-hover:animate-bounce" />
//               Download Resume
//             </button>

//             <button className="group flex items-center gap-2 border border-emerald-600 text-emerald-700 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105">
//               Get Started
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
//             </button>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { FileText, Download, ArrowRight, HeartPulse } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="w-full py-16 px-6 md:px-12 transition-all duration-300">
      
      <div
        className="
          max-w-5xl mx-auto rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8
          border shadow-xl transition-all duration-300
          bg-white dark:bg-card
          border-gray-200 dark:border-border
        "
      >

        {/* LEFT */}
        <div className="flex-1">
          
          <div className="flex items-center gap-2 mb-3 text-cyan-500 dark:text-cyan-400">
            <HeartPulse className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-muted-foreground">
              Medical Resume Builder
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground mb-3">
            Build a Clean & Professional Healthcare Resume
          </h2>

          <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
            Create ATS-friendly resumes for doctors, nurses, and healthcare professionals.
            Showcase your skills, certifications, and experience with a modern design system.
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm text-cyan-500 dark:text-cyan-400">
            <FileText className="w-4 h-4" />
            <span>Optimized for ATS • Clean Design • Fast Export</span>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row gap-4">

          <button className="
            flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
            bg-emerald-600 hover:bg-emerald-700 text-white
            dark:bg-primary dark:text-primary-foreground dark:hover:opacity-90
          ">
            <Download className="w-4 h-4" />
            Download Resume
          </button>
<button
  onClick={() =>
    document.getElementById("resume-builder")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="
    flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
    border border-gray-300 dark:border-border
    text-gray-800 dark:text-foreground
    hover:bg-gray-100 dark:hover:bg-accent
  "
>
  Get Started
  <ArrowRight className="w-4 h-4" />
</button>
          

        </div>

      </div>
    </section>
  );
}