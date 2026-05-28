import { Github, Heart, Leaf, Linkedin, Mail, MapPin, Mountain, TreePine, Twitter } from "lucide-react";

const skills = ["React", "Node.js", "TypeScript", "Python", "Tailwind CSS", "MongoDB", "GraphQL", "Docker"];

const stats = [
  { icon: TreePine, label: "Projects", value: "24+" },
  { icon: Leaf, label: "Contributions", value: "800+" },
  { icon: Mountain, label: "Experience", value: "3 Yrs" },
  { icon: Heart, label: "Clients", value: "12+" },
];

const links = [
  { icon: Mail, label: "Email", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export default function About() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 overflow-hidden py-20 px-4 md:px-8">

      {/* Floating leaves */}
      <Leaf className="absolute top-[8%] left-[4%] text-green-600 opacity-10 rotate-12 w-10 h-10" />
      <Leaf className="absolute top-[18%] right-[5%] text-green-600 opacity-10 -rotate-20 w-8 h-8" />
      <Leaf className="absolute top-[60%] left-[6%] text-green-600 opacity-10 rotate-45 w-10 h-10" />
      <Leaf className="absolute bottom-[12%] right-[7%] text-green-600 opacity-10 -rotate-12 w-8 h-8" />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs tracking-widest uppercase px-5 py-2 rounded-full mb-5">
            <Leaf className="w-3 h-3" />
            About Me
            <Leaf className="w-3 h-3" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rooted in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Nature & Code
            </span>
          </h2>
          <div className="w-20 h-1 bg-green-600 rounded-full mx-auto" />
        </div>

        {/* Bio + Avatar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <div className="w-full h-full rounded-full border border-green-700/30 flex items-center justify-center">
                <div className="w-[80%] h-[80%] rounded-full border border-emerald-700/40 flex items-center justify-center">
                  <div className="w-[75%] h-[75%] rounded-full bg-green-800 flex items-center justify-center">
                    <TreePine className="text-green-300 w-16 h-16 md:w-20 md:h-20" />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-3 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Open to Work 🌿
              </span>
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">
              Hi, I'm <span className="text-green-400">Ananya</span> 👋
            </h3>
            <p className="text-green-400 text-sm flex items-center gap-1 mb-5">
              <MapPin className="w-4 h-4" /> Mumbai, India
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              A full-stack developer inspired by the calm of nature. Like a forest that grows from tiny seeds into something vast and interconnected, I build digital ecosystems — thoughtful, scalable, and alive.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              When not writing code, you'll find me hiking trails, sketching leaves, or sipping chai while watching the rain.
            </p>
            <div className="flex flex-wrap gap-2">
              {links.map(({ icon: Icon, label, href }) => (
                
                  key={label}
                  href={href}
                  className="flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 hover:bg-green-700/50 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-green-900/20 border border-green-800/40 rounded-2xl p-6 text-center hover:border-green-600/60 hover:bg-green-900/40 transition-all duration-300"
            >
              <Icon className="text-green-400 mx-auto mb-3 w-7 h-7" />
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-green-400 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-center gap-2">
            <Leaf className="text-green-400 w-5 h-5" />
            Skills & Tools
            <Leaf className="text-green-400 w-5 h-5" />
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-green-900/30 border border-green-700/40 text-green-300 hover:bg-green-700/40 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-sm"
              >
                🌿 {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
