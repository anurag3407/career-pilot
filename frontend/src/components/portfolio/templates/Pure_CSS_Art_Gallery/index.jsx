import { usePortfolio } from '../../../../context/PortfolioContext';
import './style.css';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function PureCSSArtGallery() {
  const { portfolioData } = usePortfolio();
  const {
    personal = {},
    about = {},
    skills = [],
    projects = [],
    experience = [],
    education = [],
    socials = {},
  } = portfolioData || {};

  const featuredProjects = projects.slice(0, 3);
  const featuredExperience = experience.slice(0, 2);
  const bio = typeof about === 'string' ? about : about.bio;
  const contactEmail = personal.email || socials.email;
  const website = personal.website || socials.website || socials.github;

  return (
    <main className="pcag-shell">
      <section className="pcag-hero" aria-labelledby="pcag-title">
        <div className="pcag-hero-copy">
          <p className="pcag-kicker">{personal.location}</p>
          <h1 id="pcag-title">{personal.name}</h1>
          <p className="pcag-title">{personal.title}</p>
          <p className="pcag-tagline">{personal.tagline || personal.bio || bio}</p>
          <div className="pcag-contact" aria-label="Contact links">
            {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
            {website && <a href={website}>{website.replace(/^https?:\/\//, '')}</a>}
          </div>
        </div>

        <div className="pcag-frame" aria-label={`${personal.name} CSS portrait`}>
          <div className="pcag-sun" />
          <div className="pcag-arch">
            <div className="pcag-portrait">
              <span>{getInitials(personal.name)}</span>
            </div>
            <div className="pcag-plinth" />
          </div>
          <div className="pcag-orbit pcag-orbit-one" />
          <div className="pcag-orbit pcag-orbit-two" />
        </div>
      </section>

      <section className="pcag-gallery" aria-label="Selected projects">
        {featuredProjects.map((project, index) => (
          <article className={`pcag-art-card pcag-art-card-${index + 1}`} key={project.title}>
            <div className="pcag-art" aria-hidden="true">
              <span className="pcag-art-shape pcag-art-shape-a" />
              <span className="pcag-art-shape pcag-art-shape-b" />
              <span className="pcag-art-shape pcag-art-shape-c" />
            </div>
            <div className="pcag-card-copy">
              <p>0{index + 1}</p>
              <h2>{project.title}</h2>
              <span>{project.description}</span>
              {(project.techStack || project.tech)?.length > 0 && (
                <ul>
                  {(project.techStack || project.tech).slice(0, 3).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="pcag-details">
        <div className="pcag-panel">
          <p className="pcag-kicker">Practice</p>
          <h2>Tools and Materials</h2>
          <div className="pcag-skill-grid">
            {skills.map((skill) => (
              <span key={skill.name || skill}>{skill.name || skill}</span>
            ))}
          </div>
        </div>

        <div className="pcag-panel">
          <p className="pcag-kicker">Studio Notes</p>
          <h2>Experience</h2>
          <div className="pcag-timeline">
            {featuredExperience.map((item) => (
              <article key={`${item.role}-${item.company}`}>
                <span>{item.period}</span>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="pcag-panel pcag-panel-small">
          <p className="pcag-kicker">Archive</p>
          <h2>Education</h2>
          {(education.length ? education : [{ degree: 'Selected Work', school: personal.location, period: personal.title }]).map((item) => (
            <article key={`${item.degree}-${item.school}`}>
              <h3>{item.degree}</h3>
              <p>{item.school}</p>
              <span>{item.period}</span>
            </article>
          ))}
          <div className="pcag-socials">
            {Object.entries(socials).map(([label, url]) => (
              <a href={url} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
