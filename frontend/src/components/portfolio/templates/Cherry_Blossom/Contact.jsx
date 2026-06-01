import React from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Contact({ data }) {
  const { socials, personal } = data;
  return (
    <footer className="relative z-10 px-6 py-20 text-center">
      <h2 className="text-4xl font-bold text-rose-800">
        Let's Connect
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Interested in collaborating, building something beautiful, or just
        saying hello? Feel free to reach out.
      </p>

      {socials.email && (
        <a
          href={`mailto:${socials.email}`}
          className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-full shadow-lg hover:scale-105 transition duration-300"
        >
          <Mail />
          {socials.email}
        </a>
      )}

      <div className="flex justify-center gap-6 mt-10">
        {socials.github && (
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="hover:text-pink-500 transition duration-300 text-gray-700 hover:scale-110"
          >
            <Github />
          </a>
        )}

        {socials.linkedin && (
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            className="hover:text-pink-500 transition duration-300 text-gray-700 hover:scale-110"
          >
            <Linkedin />
          </a>
        )}

        {socials.twitter && (
          <a
            href={socials.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter Profile"
            className="hover:text-pink-500 transition duration-300 text-gray-700 hover:scale-110"
          >
            <Twitter />
          </a>
        )}
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Crafted with love inspired by Sakura blossoms
      </p>
    </footer>
  );
}
