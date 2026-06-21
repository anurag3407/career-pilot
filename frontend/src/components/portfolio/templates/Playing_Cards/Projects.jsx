import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const Projects = ({ data }) => {
  const { projects } = data;
  const [flipped, setFlipped] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [shuffledProjects, setShuffledProjects] = useState([...projects]);

  const handleShuffle = () => {
    setShuffling(true);
    setTimeout(() => {
      setShuffledProjects([...projects].sort(() => Math.random() - 0.5));
      setShuffling(false);
    }, 500);
  };

  const suits = ['♠️', '♥️', '♣️', '♦️'];
  const ranks = ['ACE', 'KING', 'QUEEN', 'JACK', '10', '9', '8', '7'];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">🃟 PROJECT DECK 🃟</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Project Cards</h2>
        <button onClick={handleShuffle} disabled={shuffling}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all">
          {shuffling ? 'Shuffling...' : '🔀 Shuffle Deck'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shuffledProjects.map((project, idx) => (
          <motion.div key={idx} layout className="relative h-[400px] perspective-1000 cursor-pointer"
            onClick={() => setFlipped(flipped === idx ? null : idx)}>
            <motion.div className="relative w-full h-full" animate={{ rotateY: flipped === idx ? 180 : 0 }} transition={{ duration: 0.6 }}>
              
              {/* Front */}
              <div className={`absolute w-full h-full backface-hidden ${flipped === idx ? 'invisible' : 'visible'}`}>
                <div className="bg-white rounded-2xl shadow-xl p-6 h-full border-2 border-purple-200">
                  <div className="absolute top-2 left-2 text-4xl opacity-20 text-purple-600">{suits[idx % 4]}</div>
                  <div className="text-2xl font-bold text-purple-700 mb-2">{ranks[idx % ranks.length]} OF {project.techStack?.[0]?.toUpperCase() || 'CODE'}</div>
                  {project.image && <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-32 object-cover rounded-lg mb-4" />}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack?.slice(0, 3).map((tech, i) => <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{tech}</span>)}
                  </div>
                  <div className="text-center text-purple-400 text-sm mt-4">Click to flip 🔄</div>
                </div>
              </div>

              {/* Back */}
              <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${flipped === idx ? 'visible' : 'invisible'}`}>
                <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl shadow-2xl p-6 h-full border-2 border-purple-400 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <p className="text-purple-200 mb-6 flex-grow">{project.description}</p>
                  <div className="mb-4"><h4 className="text-purple-300 font-semibold mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">{project.techStack?.map((tech, i) => <span key={i} className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">{tech}</span>)}</div>
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"><ExternalLink className="w-4 h-4" />Live</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg"><Github className="w-4 h-4" />Code</a>}
                  </div>
                  <div className="text-center text-purple-300 text-sm mt-4">Click to flip back 🔄</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Projects;