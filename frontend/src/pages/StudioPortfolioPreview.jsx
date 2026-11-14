import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StudioSite from '../components/portfolio/studio/StudioSite';
import { normalizeDocument, toPortfolioData } from '../components/portfolio/studio/portfolioDocument';
import { PortfolioProvider, normalizePortfolioData } from '../context/PortfolioContext';
import { getTemplateComponent, STUDIO_TEMPLATE_ID } from '../data/portfolioTemplates';

function readDocument() {
  if (typeof window === 'undefined') return normalizeDocument({});
  for (const key of ['careerpilot:portfolio:studio:v1', 'ai_portfolio_draft']) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return normalizeDocument(JSON.parse(raw));
    } catch {
      /* try the next key */
    }
  }
  return normalizeDocument({});
}

/**
 * Full-page, chrome-free preview of the document currently open in the
 * Studio. Opens in a new tab from the builder so the portfolio can be checked
 * at real viewport sizes.
 */
export default function StudioPortfolioPreview() {
  const [doc] = useState(readDocument);
  const templateId = doc.pf.templateId || STUDIO_TEMPLATE_ID;
  const TemplateComponent = useMemo(
    () => (templateId === STUDIO_TEMPLATE_ID ? null : getTemplateComponent(templateId)),
    [templateId],
  );
  const data = useMemo(() => normalizePortfolioData(toPortfolioData(doc), { isDeploy: false }), [doc]);

  return (
    <div className="relative min-h-screen">
      <Link
        to="/portfolio-builder/studio"
        className="fixed right-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-black/80"
      >
        <ArrowLeft className="h-3 w-3" /> Back to studio
      </Link>

      {templateId === STUDIO_TEMPLATE_ID ? (
        <StudioSite doc={doc} />
      ) : (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 font-mono text-xs text-zinc-400">Loading template…</div>}>
          <PortfolioProvider portfolioData={data}>
            {TemplateComponent && <TemplateComponent portfolioData={data} data={data} />}
          </PortfolioProvider>
        </Suspense>
      )}
    </div>
  );
}
