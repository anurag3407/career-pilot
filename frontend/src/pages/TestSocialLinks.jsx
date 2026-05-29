import React, { useState } from 'react';
import SocialLinksEditor from '../components/portfolio/SocialLinksEditor';

export default function TestSocialLinks() {
  const [links, setLinks] = useState(null);

  return (
    <div className="min-h-screen bg-background p-10 pt-24 text-foreground flex justify-center">
      <div className="w-full max-w-2xl bg-card p-6 rounded-3xl border border-border shadow-2xl">
        <h1 className="text-2xl font-bold mb-6">Social Links Editor Playground</h1>
        <SocialLinksEditor value={links} onChange={setLinks} />
        
        <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border">
          <h2 className="text-sm font-semibold mb-2 text-muted-foreground">Current State (JSON):</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(links, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
