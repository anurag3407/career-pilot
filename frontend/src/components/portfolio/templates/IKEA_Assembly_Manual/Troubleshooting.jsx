import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function Troubleshooting() {
  const { portfolioData } = usePortfolio();
  const socials = portfolioData?.socials || {};

  return (
    <div className="border-2 border-black p-6 md:p-12 bg-white">
      <h3 className="text-3xl font-black uppercase mb-8 border-b-2 border-black pb-4">
        3. Troubleshooting (Contact)
      </h3>
      <p className="font-bold mb-6 text-lg">Need help with assembly? Reach out to our support team.</p>
      
      <div className="flex flex-wrap gap-4">
        {socials.email && (
          <a href={`mailto:${socials.email}`} className="border-2 border-black px-6 py-3 font-black uppercase hover:bg-[#ffda1a] transition-colors flex items-center gap-2">
            Email Support
          </a>
        )}
        {socials.github && (
          <a href={socials.github} target="_blank" rel="noreferrer" className="border-2 border-black px-6 py-3 font-black uppercase hover:bg-[#ffda1a] transition-colors flex items-center gap-2">
            GitHub
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="border-2 border-black px-6 py-3 font-black uppercase hover:bg-[#ffda1a] transition-colors flex items-center gap-2">
            LinkedIn
          </a>
        )}
      </div>

      <div className="mt-12 text-center border-t-2 border-black pt-8">
        <p className="font-black uppercase text-sm">© {new Date().getFullYear()} IKEA ASSEMBLY MANUAL</p>
      </div>
    </div>
  );
}
