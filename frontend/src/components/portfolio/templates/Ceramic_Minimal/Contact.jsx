import React from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Contact({ socials = {} }) {
return ( <section
   id="contact"
   className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f5f1ed] to-[#ece6e0]"
 >
<div
className="max-w-4xl mx-auto text-center rounded-[40px] p-12"
style={{
background:
"linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,235,230,0.5) 100%)",
boxShadow: "0 12px 40px rgba(199,167,127,0.15)",
}}
> <h2 className="text-5xl font-bold text-[#3e3a37] mb-6">
Let's Create Something Beautiful </h2>

    <p className="text-[#7a6f66] text-lg mb-10">
      Open for collaborations, freelance projects,
      and meaningful conversations.
    </p>

    <a
      href={`mailto:${socials.email}`}
      className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold"
      style={{
        background:
          "linear-gradient(135deg,#c7a77f,#b8956a)",
      }}
    >
      <Mail size={18} />
      Contact Me
    </a>

    <div className="flex justify-center gap-8 mt-10">
      <a href={socials.github}>
        <Github className="text-[#8b6f47]" />
      </a>

      <a href={socials.linkedin}>
        <Linkedin className="text-[#8b6f47]" />
      </a>

      <a href={socials.twitter}>
        <Twitter className="text-[#8b6f47]" />
      </a>
    </div>
  </div>
</section>

);
}
