import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

export default function ChatbotPortfolio() {
  const { portfolioData: data } = usePortfolio();

  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: {
        type: "intro",
        text: `Hey 👋 I'm the portfolio assistant for ${data.personal.name}. Ask me about About, Skills, Projects, Experience, Testimonials, or Contact.`,
      },
    },
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const generateResponse = (text) => {
    const msg = text.toLowerCase();

    // ABOUT
    if (msg.includes("about")) {
      return {
        type: "bot",
        content: {
          type: "about",
          name: data.personal.name,
          title: data.personal.title,
          bio: data.personal.bio,
          location: data.personal.location,
          avatar: data.personal.avatar,
        },
      };
    }

    // SKILLS
    if (msg.includes("skill")) {
      return {
        type: "bot",
        content: {
          type: "skills",
          skills: data.skills,
        },
      };
    }

    // PROJECTS
    if (msg.includes("project")) {
      return {
        type: "bot",
        content: {
          type: "projects",
          projects: data.projects,
        },
      };
    }

    // EXPERIENCE
    if (msg.includes("experience")) {
      return {
        type: "bot",
        content: {
          type: "experience",
          experience: data.experience,
        },
      };
    }

    // TESTIMONIALS
    if (msg.includes("testimonial")) {
      return {
        type: "bot",
        content: {
          type: "testimonials",
          testimonials: data.testimonials,
        },
      };
    }

    // CONTACT
    if (msg.includes("contact")) {
      return {
        type: "bot",
        content: {
          type: "contact",
          socials: data.socials,
        },
      };
    }

    return {
      type: "bot",
      content: {
        type: "help",
        text: "Try asking: about, skills, projects, experience, testimonials, contact 👀",
      },
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      type: "user",
      content: { type: "text", text: input },
    };

    const botMsg = generateResponse(input);

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  // ---------------- UI RENDERERS ----------------

  const renderBotMessage = (content) => {
    switch (content.type) {
      case "about":
        return (
          <div className="space-y-2">
            <p className="font-semibold text-cyan-400">{content.name}</p>
            <p className="text-sm text-gray-300">{content.title}</p>
            <p className="text-gray-400">{content.bio}</p>
            <p className="text-xs text-gray-500">📍 {content.location}</p>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-2">
            <p className="font-semibold text-cyan-400 mb-2">Skills</p>
            {content.skills.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{s.name}</span>
                  <span>{s.level}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded">
                  <div
                    className="h-2 bg-cyan-500 rounded"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-3">
            <p className="font-semibold text-cyan-400">Projects</p>
            {content.projects.map((p, i) => (
              <div key={i} className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-gray-400">{p.description}</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  {p.techStack?.join(", ")}
                </p>
              </div>
            ))}
          </div>
        );

      case "experience":
        return (
          <div className="space-y-3">
            <p className="font-semibold text-cyan-400">Experience</p>
            {content.experience.map((e, i) => (
              <div key={i} className="border-l-2 border-cyan-600 pl-3">
                <p className="font-semibold">{e.role}</p>
                <p className="text-xs text-gray-400">
                  {e.company} • {e.period}
                </p>
                <p className="text-sm text-gray-300">{e.description}</p>
              </div>
            ))}
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-3">
            <p className="font-semibold text-cyan-400">Testimonials</p>
            {content.testimonials.map((t, i) => (
              <div key={i} className="bg-gray-900 p-3 rounded-xl">
                <p className="text-gray-300 italic">"{t.text}"</p>
                <p className="text-xs text-gray-500 mt-1">
                  — {t.name}, {t.role}
                </p>
              </div>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="space-y-2">
            <p className="font-semibold text-cyan-400">Contact</p>
            <p className="text-sm text-gray-300">Let’s connect 👇</p>
            <p className="text-xs text-gray-400">Email: {content.socials.email}</p>
            <p className="text-xs text-gray-400">GitHub: {content.socials.github}</p>
            <p className="text-xs text-gray-400">LinkedIn: {content.socials.linkedin}</p>
          </div>
        );

      default:
        return <p className="text-gray-400">{content.text}</p>;
    }
  };

  const suggestions = ["About", "Skills", "Projects", "Experience", "Testimonials", "Contact"];

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800 text-center">
        <h1 className="text-xl font-bold text-cyan-400 flex items-center justify-center gap-2">
          <Sparkles size={18} /> {data.personal.name}
        </h1>
        <p className="text-sm text-gray-400">{data.personal.title}</p>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${msg.type === "user"
                  ? "bg-cyan-600"
                  : "bg-gray-800 border border-gray-700"
                }`}
            >
              {msg.type === "user"
                ? msg.content.text
                : renderBotMessage(msg.content)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* FIX: SUGGESTIONS (added spacing + visual separation) */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-950/60 backdrop-blur flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setInput(s)}
            className="text-xs px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* INPUT (fixed spacing + better separation) */}
      <div className="p-4 border-t border-gray-800 flex gap-2 bg-gray-950">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about me..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
        />
        <button
          onClick={handleSend}
          className="bg-cyan-600 px-4 py-2 rounded-xl hover:bg-cyan-700"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}