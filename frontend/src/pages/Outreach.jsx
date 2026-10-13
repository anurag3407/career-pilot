import React, { useState } from 'react';
import { Send, Globe, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import OutreachPanel from '../components/OutreachPanel';

export default function Outreach() {
  const [companyUrl, setCompanyUrl] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const handleOpen = (e) => {
    e.preventDefault();

    const trimmed = companyUrl.trim();

    if (!/^https?:\/\/.+/i.test(trimmed)) {
      toast.error('Enter a full company URL starting with http:// or https://');
      return;
    }

    // Derive a readable name from the hostname for the drawer header.
    let name = 'Company';
    try {
      name = new URL(trimmed).hostname.replace(/^www\./, '');
    } catch {
      // Defensive: validation above already covers malformed input.
    }

    setCompanyName(name);
    setPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Send className="w-4 h-4" />
            AI cold outreach
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Cold Outreach
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We research the company, review your resume, and draft several outreach angles
            you can send as-is or edit.
          </p>
        </div>

        <form
          onSubmit={handleOpen}
          className="p-6 rounded-2xl bg-background/60 border border-border space-y-5"
        >
          <div>
            <label htmlFor="outreach-url" className="block text-sm font-medium text-foreground mb-2">
              Company website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                id="outreach-url"
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate outreach
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 p-4 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
          <Send className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            Nothing is sent for you — you get drafts to review, edit, and send yourself.
            Always check the company actually exists before reaching out.
          </p>
        </div>
      </div>

      {panelOpen && (
        <OutreachPanel
          companyName={companyName}
          companyUrl={companyUrl.trim()}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}