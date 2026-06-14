import React, { useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

const Inspired_Chris_Otto = () => {
  const { portfolioData: data } = usePortfolio();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const { personal, projects, experience, skills, socials } = data || {};

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white antialiased transition-colors duration-300 font-sans">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <div className="flex flex-col justify-between min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between py-10">
              <div>
                <a aria-label={personal?.name} href="#">
                  <div className="flex items-center justify-between">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="53.87" viewBox="0 0 375 375" height="43.61">
                        <path d="M155.504 51.953c26.894 0 51.351 6.024 73.375 18.063 22.031 12.03 39.383 28.617 52.062 49.75 12.688 21.125 19.032 44.625 19.032 70.5s-6.344 49.445-19.032 70.703c-12.68 21.25-30.03 37.96-52.062 50.125-22.024 12.168-46.48 18.25-73.375 18.25-26.899 0-51.36-6.082-73.39-18.25-22.032-12.164-39.387-28.813-52.063-49.938-12.68-21.133-19.016-44.765-19.016-70.89 0-25.875 6.336-49.375 19.016-70.5 12.676-21.133 29.96-37.72 51.86-49.75 21.905-12.04 46.437-18.063 73.593-18.063Zm.766 53.016c-14.856 0-28.688 3.781-41.5 11.343-12.805 7.555-22.918 17.86-30.344 30.922-7.43 13.063-11.14 27.407-11.14 43.032 0 15.875 3.773 30.351 11.327 43.421 7.551 13.063 17.664 23.438 30.344 31.125 12.688 7.68 26.457 11.516 41.313 11.516 14.851 0 28.488-3.773 40.906-11.328 12.426-7.563 22.289-17.938 29.594-31.125 7.3-13.195 10.953-27.734 10.953-43.61 0-15.624-3.653-29.968-10.953-43.03-7.305-13.063-17.168-23.368-29.594-30.923-12.418-7.562-26.055-11.343-40.906-11.343Zm0 0" fill="#90adc6"></path>
                        <path d="M260.184 139.24c-9.336-11.156-20.293-19.906-32.875-26.25-12.575-6.351-25.215-9.53-37.922-9.53-15.305 0-29.309 3.761-42.016 11.28-12.7 7.524-22.683 17.766-29.953 30.735-7.262 12.96-10.89 27.352-10.89 43.172 0 15.812 3.628 30.273 10.89 43.375 7.27 13.094 17.254 23.469 29.953 31.125 12.707 7.648 26.711 11.469 42.016 11.469 12.187 0 24.566-2.914 37.14-8.75 12.582-5.832 23.801-13.68 33.657-23.547l36.187 39.297c-14.531 15.043-31.59 26.976-51.172 35.796-19.574 8.813-39.215 13.22-58.922 13.22-26.71 0-50.96-6.157-72.75-18.47-21.78-12.32-38.898-29.242-51.343-50.765-12.45-21.531-18.672-45.52-18.672-71.969 0-26.195 6.351-49.926 19.062-71.187 12.707-21.27 30.145-38 52.313-50.188 22.176-12.187 46.75-18.281 73.718-18.281 19.708 0 39.157 4.086 58.344 12.25 19.196 8.168 35.54 19.258 49.031 33.265Zm0 0" fill="#1f628e"></path>
                      </svg>
                    </div>
                    <div className="hidden h-6 text-2xl font-semibold sm:block">{personal?.name || "Portfolio"}</div>
                  </div>
                </a>
              </div>
              <div className="flex items-center text-base leading-5">
                <div className="hidden sm:block">
                  <a className="p-1 font-medium text-gray-900 hover:text-sky-600 dark:text-gray-100 dark:hover:text-sky-400 sm:p-4 transition-colors" href="#projects">Projects</a>
                  <a className="p-1 font-medium text-gray-900 hover:text-sky-600 dark:text-gray-100 dark:hover:text-sky-400 sm:p-4 transition-colors" href="#experience">Experience</a>
                  <a className="p-1 font-medium text-gray-900 hover:text-sky-600 dark:text-gray-100 dark:hover:text-sky-400 sm:p-4 transition-colors" href="#skills">Skills</a>
                </div>
                <button aria-label="Toggle Dark Mode" type="button" className="ml-1 mr-1 h-8 w-8 rounded p-1 sm:ml-4" onClick={toggleTheme}>
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-gray-900 dark:text-gray-100"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  )}
                </button>
              </div>
            </header>

            <main className="mb-auto">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Hero */}
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                  <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    {personal?.title || "Digital Garden"}
                  </h1>
                  <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
                    {personal?.tagline || personal?.bio || "Welcome to my portfolio."}
                  </p>
                </div>

                {/* Projects */}
                <ul id="projects" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projects?.map((project, index) => (
                    <li key={index} className="py-6">
                      <article className="block w-full gap-6 space-y-2 rounded-xl xl:grid xl:grid-cols-2 xl:items-start transition-colors hover:bg-gray-100 dark:hover:bg-sky-700/40 p-4">
                        {project.image && (
                          <a href={project.liveUrl || project.githubUrl || "#"} className="text-gray-900 dark:text-gray-100 block overflow-hidden rounded-xl">
                            <img alt={project.title} src={project.image} className="w-full h-auto object-cover rounded-xl transition duration-300 ease-in-out hover:scale-105" loading="lazy" />
                          </a>
                        )}
                        <div className="space-y-6">
                          <div className="space-y-5 xl:col-span-3">
                            <a href={project.liveUrl || project.githubUrl || "#"} className="text-gray-900 dark:text-gray-100">
                              <div>
                                <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">{project.title}</h2>
                                <dl>
                                  <dt className="sr-only">Published on</dt>
                                </dl>
                              </div>
                              <div className="prose max-w-none text-gray-500 dark:text-gray-400 mt-3 line-clamp-3">
                                {project.description}
                              </div>
                            </a>
                            <div className="flex flex-wrap mt-4">
                              {project.techStack?.map((tech, i) => (
                                <span key={i} className="mr-3 text-sm font-medium uppercase text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>

                {/* Experience */}
                <div id="experience" className="py-10">
                  <div className="space-y-2 md:space-y-5 mb-8">
                    <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">Experience</h2>
                  </div>
                  <div className="space-y-8">
                    {experience?.map((job, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-sky-700/40">
                        <div className="md:w-1/3 shrink-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{job.company}</h3>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">{job.period}</p>
                        </div>
                        <div className="md:w-2/3 space-y-2">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{job.role}</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{job.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div id="skills" className="py-10">
                  <div className="space-y-2 md:space-y-5 mb-8">
                    <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-4 p-4">
                    {skills?.map((skill, index) => (
                      <span key={index} className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter Form */}
                <div className="flex items-center justify-center py-12">
                  <div>
                    <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">Subscribe to the newsletter</div>
                    <form className="flex flex-col sm:flex-row mt-4" onSubmit={(e) => e.preventDefault()}>
                      <div>
                        <label className="sr-only" htmlFor="email-input">Email address</label>
                        <input autoComplete="email" className="w-72 rounded-md px-4 py-2 border border-gray-300 dark:border-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-600 dark:bg-black dark:text-white" id="email-input" name="email" placeholder="Enter your email" required type="email" />
                      </div>
                      <div className="mt-2 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3">
                        <button className="w-full rounded-md bg-sky-500 py-2 px-4 font-medium text-white sm:py-0 hover:bg-sky-600 dark:hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 dark:ring-offset-black transition-colors" type="submit">Sign up</button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col items-center pb-8 pt-8">
              <div className="mb-5 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <a href="/">{personal?.name} | {personal?.title}</a>
                <div> • </div>
                <div>© {new Date().getFullYear()}</div>
              </div>
              <div className="mb-3 flex space-x-8">
                {socials?.email && (
                  <a href={`mailto:${socials.email}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path></svg>
                  </a>
                )}
                {socials?.github && (
                  <a href={socials.github} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                  </a>
                )}
                {socials?.linkedin && (
                  <a href={socials.linkedin} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
                  </a>
                )}
                {socials?.twitter && (
                  <a href={socials.twitter} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
                  </a>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspired_Chris_Otto;
