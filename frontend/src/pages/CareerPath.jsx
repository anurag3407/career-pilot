import React, { useState } from 'react';
import { GraduationCap, Loader2, Plus, X, Target, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { enhanceApi } from '../services/api';

export default function CareerPath() {
  const [currentRole, setCurrentRole] = useState('');
  const [years, setYears] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      toast.error('That skill is already in the list.');
      return;
    }
    // The backend caps the list at 10 skills, so stop before silently dropping input.
    if (skills.length >= 10) {
      toast.error('You can add up to 10 skills.');
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentRole.trim() && skills.length === 0) {
      toast.error('Add your current role or at least one skill.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await enhanceApi.careerTrajectory({
        currentRole: currentRole.trim(),
        skills,
        yearsOfExperience: years ? Number(years) : 0,
        industry: industry.trim() || 'Technology',
      });

      if (response?.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error('The career service returned an unexpected response.');
      }
    } catch (error) {
      toast.error(error.message || 'Could not map your career path.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <GraduationCap className="w-4 h-4" />
            Career trajectory
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Where you could go next
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Map realistic next roles from where you are today, with the skills each one
            needs and a roadmap to get there.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-background/60 border border-border space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="career-role" className="block text-sm font-medium text-foreground mb-2">
                Current role
              </label>
              <input
                id="career-role"
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Backend Engineer"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="career-years" className="block text-sm font-medium text-foreground mb-2">
                Years of experience
              </label>
              <input
                id="career-years"
                type="number"
                min="0"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g. 4"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="career-industry" className="block text-sm font-medium text-foreground mb-2">
              Industry
            </label>
            <input
              id="career-industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Technology, Fintech, Healthcare"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="career-skill" className="block text-sm font-medium text-foreground mb-2">
              Your skills
            </label>
            <div className="flex gap-2">
              <input
                id="career-skill"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary/50 transition"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill}>
                    <button
                      type="button"
                      onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition"
                      aria-label={`Remove ${skill}`}
                    >
                      {skill}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Map my path'}
          </button>
        </form>

        {result && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-5"
            aria-live="polite"
          >
            {result.currentProfileSummary && (
              <div className="p-5 rounded-2xl bg-background/60 border border-border">
                <h2 className="text-sm font-medium text-muted-foreground mb-1">Where you are now</h2>
                <p className="text-foreground">{result.currentProfileSummary}</p>
              </div>
            )}

            <div className="space-y-4">
              {(result.careerPaths || []).map((path, index) => (
                <article key={`${path.title}-${index}`} className="p-5 rounded-2xl bg-background/60 border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{path.title}</h3>
                    {typeof path.matchScore === 'number' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        <Target className="w-3.5 h-3.5" />
                        {Math.round(path.matchScore)}% fit
                      </span>
                    )}
                  </div>

                  {path.reasoning && (
                    <p className="text-sm text-muted-foreground mb-4">{path.reasoning}</p>
                  )}

                  {Array.isArray(path.requiredSkills) && path.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Skills to build</h4>
                      <ul className="flex flex-wrap gap-2">
                        {path.requiredSkills.map((skill) => (
                          <li
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-muted/60 border border-border text-xs text-muted-foreground"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(path.learningRoadmap) && path.learningRoadmap.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Roadmap</h4>
                      <ol className="space-y-1.5 list-decimal list-inside text-sm text-muted-foreground">
                        {path.learningRoadmap.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {Array.isArray(result.recommendedNextSteps) && result.recommendedNextSteps.length > 0 && (
              <div className="p-5 rounded-2xl bg-background/60 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">Do this next</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {result.recommendedNextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Use these as directional guidance, then validate against real job postings before you commit.</p>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}