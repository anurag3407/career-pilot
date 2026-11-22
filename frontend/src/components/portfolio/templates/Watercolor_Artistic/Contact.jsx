export default function Contact() {
  return (
    <section className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 py-20 relative z-10">

      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 opacity-30 blur-3xl rounded-full pointer-events-none"></div>

<div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 opacity-30 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="max-w-xl mx-auto p-8 bg-white/50 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl hover:shadow-purple-200/50 transition duration-300 relative z-10">

        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-center">
          Get in Touch
        </h2>

        <p className="text-gray-600 mb-10 text-center">
          Have a question or want to work together? Fill out the form below.
        </p>

        <form
  className="grid gap-6"
  onSubmit={(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log(data);
    alert("Message sent!");

    e.target.reset();
  }}
>

          {/* Name */}
          <input
  type="text"
  placeholder="Your Name"
  className="w-full p-3 rounded-xl border border-gray-200 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
/>

          {/* Email */}
          <input
  type="email"
  placeholder="Your Email"
  className="w-full p-3 rounded-xl border border-gray-200 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
/>

          {/* Message */}
          <textarea
  rows="5"
  placeholder="Your Message"
  className="w-full p-3 rounded-xl border border-gray-200 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
/>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl hover:scale-105 hover:shadow-lg transition"
          >
            Send Message
          </button>

        </form>
      </div>

    </section>
  );
}