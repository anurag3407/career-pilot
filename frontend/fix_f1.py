import re

with open('original_f1_projects.jsx', 'r') as f:
    content = f.read()

# The file contains multiple copies of the file inside itself.
# We want the content from the start up to the FIRST `export default function Projects({ data }) {`
# Which happens at line 553.
# And we also want the content AFTER the end of that injected component.
# The injected component ends around line 647 `  );` `}`
# Let's just find `export default function Projects({ data }) {` and `export default function Projects() {`

parts = content.split("export default function Projects({ data }) {")
header = parts[0]

# After the first split, the rest contains the subagent's code, then the rest of the original code.
rest = parts[1]
# The original code resumes right before `function ProjectCard({ project }) {`
# Let's split rest by `function ProjectCard({ project }) {`
rest_parts = rest.split("function ProjectCard({ project }) {")
if len(rest_parts) > 1:
    middle = "function ProjectCard({ project }) {" + rest_parts[1]
else:
    middle = rest

# Now `middle` contains the rest of the original code, starting from `function ProjectCard`.
# In `middle`, we find `export default function Projects() {` and replace it with `export default function Projects({ data }) {`
middle = middle.replace("export default function Projects() {", "export default function Projects({ data }) {")

# In `middle`, we also need to find the `const projects = [` and rename it to `const fallbackProjects = [`
middle = middle.replace("const projects = [", "const fallbackProjects = [")

# And inside `export default function Projects({ data }) {`, we add the useMemo for `projects`.
memo_code = """
  const projects = useMemo(() => {
    if (data?.projects && data.projects.length > 0) {
      return data.projects.map((p, i) => {
        const teams = ["ferrari", "mercedes", "redbull", "mclaren", "aston", "racingbulls"];
        return {
          id: i + 1,
          title: p.title || p.name || f"Project {i + 1}",
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

# Insert memo_code right after `useF1Fonts();`
middle = middle.replace("useF1Fonts();", "useF1Fonts();\n" + memo_code)

final_code = header + middle

with open('src/components/portfolio/templates/F1_Racing/Projects.jsx', 'w') as f:
    f.write(final_code)

