import React from 'react';
import { Terminal, Send, Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact({ personal, socials }) {
  return (
    <section className="w-full bg-black text-green-400 flex items-center justify-center px-4 py-8 pb-20">
      <div className="w-full max-w-6xl">
        <div className="bg-zinc-950 border border-green-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 flex items-center gap-2 text-xs text-green-300">
              <Terminal size={14} />
              <span>contact.sh</span>
            </div>
          </div>
          <div className="p-6 md:p-10 font-mono">
            <p className="text-green-500 mb-6">
              visitor@portfolio:~$ <span className="text-white">./init_connection.sh</span>
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 mb-6">
                  Establishing secure connection...<br/>
                  Connection established.<br/>
                  Awaiting input to send message to {personal?.name || 'Owner'}...
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-green-500"># Direct communication links:</span>
                    {personal?.email && (
                      <a href={`mailto:${personal.email}`} className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors">
                        <Mail size={16} /> <span>{personal.email}</span>
                      </a>
                    )}
                  </div>
                  
                  {socials && socials.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      <span className="text-green-500"># Social network nodes:</span>
                      <div className="flex gap-4">
                        {socials.map((social, i) => (
                          <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-green-400 transition-colors">
                            {social.platform.toLowerCase() === 'github' && <Github size={20} />}
                            {social.platform.toLowerCase() === 'linkedin' && <Linkedin size={20} />}
                            {social.platform.toLowerCase() === 'twitter' && <Twitter size={20} />}
                            {!['github', 'linkedin', 'twitter'].includes(social.platform.toLowerCase()) && <span>{social.platform}</span>}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="mb-2 block text-green-400">
                      $ enter_name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-green-400">
                      $ enter_email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-green-400">
                      $ enter_message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full rounded-lg border border-green-500/20 bg-zinc-950 px-4 py-3 text-green-300 outline-none transition focus:border-green-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-500/10 px-5 py-3 text-green-400 transition hover:bg-green-500/20 font-mono mt-4"
                  >
                    <Send size={16} />
                    <span>$ execute send-message</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-8 flex items-center">
              <span className="text-green-500">visitor@portfolio:~$</span>
              <span className="ml-1 h-5 w-2 bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}