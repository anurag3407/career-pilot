with open('original_f1_projects.jsx', 'r') as f:
    lines = f.readlines()

# 1. Keep lines 0 to 548 (inclusive, meaning up to line index 547)
header = lines[:548]

# 2. Add the missing closing brace for BgNumbers()
header.append("  );\n")
header.append("}\n\n")

# 3. Skip lines 549 to 658 (indices 548 to 657). 
# We resume from line 659 (index 658), which is `const PIT_WALL_COLORS = {`
rest = lines[658:]

content = "".join(header) + "".join(rest)

# Now we have the pure, original PR file without the corruption!
# Let's replace the hardcoded data array `const projects = [` with `const fallbackProjects = [`
content = content.replace("const projects = [", "const fallbackProjects = [")

# Change the export signature
content = content.replace("export default function Projects() {", "export default function Projects({ data }) {")

# Inject the dynamic mapping memo
memo_code = """
  const projects = useMemo(() => {
    if (data?.projects && data.projects.length > 0) {
      return data.projects.map((p, i) => {
        const teams = ["ferrari", "mercedes", "redbull", "mclaren", "aston", "racingbulls"];
        return {
          id: i + 1,
          title: p.title || p.name || `Project ${i + 1}`,
          category: p.category || "Fullstack",
          description: p.description || "A high performance project.",
          technologies: p.technologies || p.techStack || ["React"],
          team: teams[i % teams.length],
          status: "Complete",
          metrics: [
             { label: "Optimization", value: "Max" },
             { label: "Status", value: "Deployed" }
          ],
          demoUrl: p.liveUrl || p.demoUrl || p.link || "#",
          repoUrl: p.githubUrl || p.repoUrl || p.sourceUrl || "#",
        };
      });
    }
    return fallbackProjects;
  }, [data]);
"""

content = content.replace("useF1Fonts();", "useF1Fonts();\n" + memo_code)

with open('src/components/portfolio/templates/F1_Racing/Projects.jsx', 'w') as f:
    f.write(content)

