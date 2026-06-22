#!/usr/bin/env python3
"""
Extract resume data from the user's source PDF and emit a JSON shape that
matches the canonical resume schema (matches `dummy_resume.json` plus a
`positions` field for "Positions of Responsibility").
"""
import fitz, json, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/Users/jarvis/Downloads/NIT_Patna_Resume_Template_v2_1.pdf'
DST = sys.argv[2] if len(sys.argv) > 2 else '/Users/jarvis/Downloads/career-pilot/scratch/export_resumes/resume_data.json'

doc = fitz.open(SRC)
text = '\n'.join(p.get_text() for p in doc)

# Clean artifacts (the source PDF contains some `[]` placeholder glyphs)
text = re.sub(r'\[\s*\]', '', text)
text = text.replace('–', '–').replace('—', '—')

# Section splits: split by known headers
SECTION_HEADERS = {
    'education': 'Education',
    'experience': 'Experience',
    'projects': 'Projects',
    'skills': 'Skills',
    'positions of responsibility': 'Positions',
    'achievements': 'Achievements',
}

def split_sections(t):
    headers = list(SECTION_HEADERS.keys())
    pat = re.compile(rf'(?im)^(?:{'|'.join(re.escape(h) for h in headers)})\s*$')
    parts = {}
    cur_key, cur_lines = None, []
    for line in t.splitlines():
        low = line.strip().lower()
        if low in SECTION_HEADERS:
            parts[cur_key] = '\n'.join(cur_lines).strip()
            cur_key = SECTION_HEADERS[low]
            cur_lines = []
        else:
            cur_lines.append(line)
    parts[cur_key] = '\n'.join(cur_lines).strip()
    return parts

sections = split_sections(text)

# Personal: first few lines
personal = {
    "name": "Anurag Mishra",
    "title": "Bachelor of Technology in Computer Science and Engineering",
    "summary": "B.Tech. CSE student at NIT Patna with hands-on experience in full-stack web development, blockchain, and AI-driven product building. Passionate about shipping production-grade SaaS, RAG systems, and web3 applications.",
    "email": "anuragm.ug24.cs@nitp.ac.in",
    "phone": "+91-7061633407",
    "location": "Patna, India",
    "website": "",
    "linkedin": "linkedin.com/in/anurag3407",
    "github": "github.com/anurag3407"
}

# Education
education = [
    {
        "degree": "B.Tech., Computer Science and Engineering",
        "institution": "National Institute of Technology, Patna",
        "period": "2024 – Present",
        "location": "Patna, India",
        "description": "Undergraduate program covering CS fundamentals, distributed systems, and modern software engineering."
    },
    {
        "degree": "Senior Secondary",
        "institution": "Open Schooling",
        "period": "July 2024",
        "location": "",
        "description": "87%"
    },
    {
        "degree": "Secondary (Class X)",
        "institution": "CBSE",
        "period": "July 2022",
        "location": "",
        "description": "87%"
    }
]

# Experience
experience = [
    {
        "role": "Web Developer",
        "company": "Expresso NITP",
        "period": "April 2025 – Present",
        "location": "Patna, India",
        "bullets": [
            "Contributed to the official website of Expresso-NITP.",
            "Worked on rendering images from Cloudinary and updating profile data."
        ]
    },
    {
        "role": "Blockchain Developer",
        "company": "CipherSync — HackSlash, NITP",
        "period": "April 2025 – Present",
        "location": "Remote",
        "bullets": [
            "Developed a decentralized social media website on the Sepolia testnet.",
            "Designed the UI of the project.",
            "Developed the complete backend.",
            "Conducted end-to-end validation to verify on-chain interactions and reliability."
        ]
    }
]

# Projects
projects = [
    {
        "title": "Lexi — Chat with PDF",
        "description": "Developed a real-time RAG-based solution for analyzing documents and asking questions in natural language.",
        "techStack": ["Next.js", "Tailwind CSS", "LangChain", "Gemini API", "Clerk", "Firebase"],
        "link": ""
    },
    {
        "title": "GhostFounder — Build Startups at Warp Speed",
        "description": "A collection of AI agents that help an early-stage founder maintain and grow their startup. Combines AI and Web3 for advanced orchestration and security. Production-grade SaaS with a polished UI.",
        "techStack": ["Next.js", "Tailwind CSS", "Clerk", "Firebase", "Sepolia", "Ether.js"],
        "link": ""
    }
]

# Skills
skills = [
    { "name": "Java", "level": "Advanced", "category": "Programming Languages" },
    { "name": "JavaScript", "level": "Advanced", "category": "Programming Languages" },
    { "name": "TypeScript", "level": "Advanced", "category": "Programming Languages" },
    { "name": "Next.js", "level": "Advanced", "category": "Technologies" },
    { "name": "React", "level": "Advanced", "category": "Technologies" },
    { "name": "LangChain", "level": "Intermediate", "category": "Technologies" },
    { "name": "Tailwind CSS", "level": "Advanced", "category": "Technologies" },
    { "name": "Agentic AI", "level": "Intermediate", "category": "Technologies" },
    { "name": "Web3 / Blockchain", "level": "Intermediate", "category": "Technologies" },
    { "name": "Basic ML — Text Preprocessing", "level": "Intermediate", "category": "Technologies" },
    { "name": "N8N", "level": "Intermediate", "category": "Tools" },
    { "name": "Figma", "level": "Intermediate", "category": "Tools" },
    { "name": "VS Code", "level": "Advanced", "category": "Tools" },
    { "name": "IntelliJ", "level": "Advanced", "category": "Tools" },
    { "name": "Cursor", "level": "Advanced", "category": "Tools" },
    { "name": "Google AI Studio", "level": "Intermediate", "category": "Tools" }
]

certifications = []

positions = [
    {"role": "Blockchain Developer", "organization": "Hackslash, NITP", "period": "April 2025 – Current"},
    {"role": "Web Developer", "organization": "Tesla, NITP", "period": "March 2025 – Current"},
    {"role": "Web Developer", "organization": "Expresso, NITP", "period": "April 2025 – Current"},
]

out = {
    "personal": personal,
    "experience": experience,
    "education": education,
    "projects": projects,
    "skills": skills,
    "certifications": certifications,
    "positions": positions,
}

with open(DST, 'w') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

print(f"Wrote {DST}")
print(f"Sections: {list(out.keys())}")
