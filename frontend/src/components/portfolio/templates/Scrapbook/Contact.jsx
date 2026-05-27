import React from 'react';

export default function Contact() {
  let handleClick = (e) => {
    e.preventDefault();
    alert("Your message has been submitted!");
  };
  return (
    <section className="bg-[radial-gradient(ellipse_at_center,_#f5e6c8_30%,_#c4956a_100%)] min-h-[400px] w-full flex items-center justify-center font-serif py-[30px] px-5">
      <div className="flex justify-center items-center gap-[30px] flex-wrap">
        <div className="p-5 border-2 border-[#c4a96a] rounded-[4px] w-[250px] bg-[#f5e6c8] -rotate-[1.5deg] hover:rotate-0 shadow-[4px_4px_0px_#b8945a] transition-transform duration-200">
          <p className="text-[#5C4033] font-bold text-[22px] mb-1.5">
            Career Pilot
          </p>
          <p className="text-[#7a4a1e] text-[13px] mb-2.5">
            Take your journey to a new level!
          </p>
          <p className="text-[#7a4a1e] text-[13px]">
            📧{" "}
            <a href="." className="text-[#7a4a1e]">
              support@careerpilot.com
            </a>
          </p>
          <p className="text-[#7a4a1e] text-[13px]">📍 Mumbai, India</p>
          <p className="text-[#7a4a1e] text-[13px] mb-3">
            ⏰ Responds within 24 hours
          </p>
          <p className="text-[#5C4033] font-bold text-[14px]">
            Find us on socials!
          </p>
          <button className="w-[90px] m-[5px] h-[35px] text-[13px] text-white bg-[#800020] hover:bg-[#5c0015] border-none rounded-[3px] cursor-pointer transition-colors duration-200">
            LinkedIn
          </button>
          <button className="w-[90px] m-[5px] h-[35px] text-[13px] text-white bg-[#800020] hover:bg-[#5c0015] border-none rounded-[3px] cursor-pointer transition-colors duration-200">
            Instagram
          </button>
        </div>

        <div className="p-5 border-2 border-[#c4a96a] rounded-[4px] w-[250px] bg-[#fef9e7] rotate-[1.5deg] hover:rotate-0 shadow-[4px_4px_0px_#b8945a] transition-transform duration-200">
          <p className="text-center text-[20px] text-[#5C4033] font-bold">
            Get in touch ✉️
          </p>
          <p className="text-center text-[11px] text-[#7a4a1e] mb-2.5">
            We'll get back within 24 hours!
          </p>
          <form onSubmit={handleClick}>
            <input
              type="text"
              placeholder="Your name"
              className="w-full h-[28px] border border-[#c4a96a] my-[3px] text-[13px] px-2 bg-[#fdf6e3] font-serif"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full h-[28px] border border-[#c4a96a] my-[3px] text-[13px] px-2 bg-[#fdf6e3] font-serif"
            />
            <textarea
              placeholder="Your message..."
              rows="3"
              className="w-full h-[60px] border border-[#c4a96a] my-[3px] text-[13px] py-1.5 px-2 bg-[#fdf6e3] resize-none font-serif"
            />
            <input
              type="submit"
              value="Send Message"
              className="w-full bg-[#800020] hover:bg-[#5c0015] text-white p-2 border-none text-[13px] cursor-pointer mt-1.5 rounded-[3px] font-serif transition-colors duration-200"
            />
          </form>
        </div>
      </div>
    </section>
  );
}

