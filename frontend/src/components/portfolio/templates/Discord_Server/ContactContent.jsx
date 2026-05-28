import React from 'react';
import { GithubIcon, Linkedin, Twitter, Mail, Send } from 'lucide-react';
import { Message, Divider } from './MessageComponents';

export function ContactContent({ data }) {
  const p = data.personal;
  const s = data.socials;

  const links = [
    s.github && { icon: Github, label: 'GitHub', url: s.github, color: '#DBDEE1' },
    s.linkedin && { icon: Linkedin, label: 'LinkedIn', url: s.linkedin, color: '#0A66C2' },
    s.twitter && { icon: Twitter, label: 'Twitter', url: s.twitter, color: '#1DA1F2' },
    s.email && { icon: Mail, label: 'Email', url: `mailto:${s.email}`, color: '#EB459E' },
  ].filter(Boolean);

  return (
    <div className="py-4 space-y-1">
      <Divider text="Get In Touch" />
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:50 AM"
        isBot
        index={0}
      >
        <p>📬 Want to connect with <span className="font-semibold text-white">{p.name}</span>? Here's how:</p>
      </Message>

      <Message avatar={p.avatar} name={p.name} timestamp="Today at 12:51 AM" index={1}>
        <div className="max-w-[520px] mt-1 flex rounded overflow-hidden bg-[#2B2D31] border border-[#1E1F22]">
          <div className="w-1 shrink-0 bg-[#5865F2]" />
          <div className="p-4 flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#00AFF4] mb-3">🔗 Social Links</div>
            <div className="space-y-2">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[#DBDEE1] hover:text-white py-1.5 px-2 rounded hover:bg-[#383A40] transition-colors group"
                >
                  <link.icon className="w-5 h-5 shrink-0" style={{ color: link.color }} />
                  <span className="group-hover:underline">{link.label}</span>
                  <span className="text-[#949BA4] text-xs ml-auto truncate hidden sm:inline">
                    {link.url.replace('mailto:', '').replace('https://', '')}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Message>

      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:52 AM"
        isBot
        index={2}
      >
        <p>Feel free to reach out! {p.name.split(' ')[0]} is always open to new opportunities and collaborations. 🤝</p>
      </Message>

      {/* Fake message input */}
      <div className="px-4 pb-4 pt-6">
        <div className="bg-[#383A40] rounded-lg flex items-center px-4 py-2.5">
          <span className="text-[#6D6F78] text-sm flex-1">Message #{`contact`}</span>
          <Send className="w-5 h-5 text-[#6D6F78]" />
        </div>
      </div>
    </div>
  );
}
