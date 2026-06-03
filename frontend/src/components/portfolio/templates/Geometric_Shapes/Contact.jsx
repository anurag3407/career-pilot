import  React from "react";
export default function Contact() {
  return(
    <section className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6 py-16">

      {/* Background Shapes */}

     <div className="absolute top-10 left-10 w-40 h-40 bg-pink-500 rotate-45 opacity-20"></div>

     <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-cyan-500 opacity-20"></div>

     <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-yellow-400 rotate-12"></div>


    {/* Main Card */}

    <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg border border-pink-500/20 rounded-3xl p-10 w-full max-w-2xl shadow-2xl">

    <h2 className="text-5xl font-extrabold text-center text-white mb-4">

      Contact Me

    </h2>

    <p className="text-center text-gray-300 mb-10">

      Let’s build something creative together.

    </p>

    <div className="grid md:grid-cols-2 gap-6">

  <input
    type="text"
    placeholder="Your Name"
    className="p-4 rounded-xl bg-gray-800 border border-white/20 text-white caret-pink-400 placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
  />

  <input
    type="email"
    placeholder="Your Email"
    className="p-4 rounded-xl bg-gray-800 border border-white/20 text-white caret-pink-400 placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
  />

</div>

<textarea
  rows="5"
  placeholder="Your Message"
  className="w-full mt-6 p-4 rounded-xl bg-gray-800 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
/>

<button
  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 py-4 rounded-xl text-white font-semibold text-lg hover:scale-105 transition duration-300 shadow-lg shadow-pink-500/30"
>
  Send Message
</button>

</div>

    </section>


  )
}
