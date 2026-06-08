import React from 'react';
import { motion } from 'framer-motion';

const NavBar = () => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-max max-w-full overflow-x-auto bg-[#fdf3e7] border-4 border-[#2b1318] rounded-full px-6 py-4 shadow-[6px_6px_0px_0px_#2b1318] md:shadow-[8px_8px_0px_0px_#2b1318] justify-start md:justify-center items-center flex gap-6 md:gap-8 font-black font-sans text-sm sm:text-base md:text-xl text-[#2b1318] uppercase tracking-wider scrollbar-hide will-change-transform"
  >
    <a href="#about" className="hover:text-[#ff5e57] transition-colors relative group whitespace-nowrap">
      About <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#ff5e57] transition-all group-hover:w-full rounded-full"></span>
    </a>
    <a href="#skills" className="hover:text-[#ff5e57] transition-colors relative group whitespace-nowrap">
      Skills <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#ff5e57] transition-all group-hover:w-full rounded-full"></span>
    </a>
    <a href="#projects" className="hover:text-[#ff5e57] transition-colors relative group whitespace-nowrap">
      Projects <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#ff5e57] transition-all group-hover:w-full rounded-full"></span>
    </a>
    <a href="#experience" className="hover:text-[#ff5e57] transition-colors relative group whitespace-nowrap">
      Experience <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#ff5e57] transition-all group-hover:w-full rounded-full"></span>
    </a>
  </motion.nav>
);

export default NavBar;