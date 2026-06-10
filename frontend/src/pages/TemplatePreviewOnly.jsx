import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PortfolioProvider } from '../context/PortfolioContext';

export default function TemplatePreviewOnly() {
  const { templateId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    // Read the draft data from localStorage
    const draft = localStorage.getItem('ai_portfolio_draft');
    if (draft) {
      try {
        setPortfolioData(JSON.parse(draft));
      } catch (e) {
        console.error('Error parsing ai_portfolio_draft', e);
      }
    }
    
    // Listen for messages from the parent window (useful if we want to live-update)
    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_PORTFOLIO_DATA') {
        setPortfolioData(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const Component = useMemo(() => {
    if (!templateId) return null;
    return React.lazy(() =>
      import(`../components/portfolio/templates/${templateId}/index.jsx`).catch(() => {
        // Fallback for flat files without index.jsx if they exist
        return import(`../components/portfolio/templates/${templateId}.jsx`).catch(() => {
            return { default: () => <div className="p-10 text-red-500 font-mono">Failed to load template: {templateId}</div> };
        });
      })
    );
  }, [templateId]);

  if (!templateId) return null;

  return (
    <Suspense fallback={<div className="w-full h-full min-h-screen bg-black flex items-center justify-center text-white font-mono">Loading Template...</div>}>
      <PortfolioProvider portfolioData={portfolioData}>
        <Component portfolioData={portfolioData} />
      </PortfolioProvider>
    </Suspense>
  );
}
