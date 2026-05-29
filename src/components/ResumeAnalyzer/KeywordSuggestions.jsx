import { motion as Motion } from 'framer-motion';

function TagCloud({ title, keywords, variant }) {
  const isFound = variant === 'found';
  const tagClass = isFound
    ? 'bg-primary/10 text-primary border-primary/30'
    : 'bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-primary';

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {keywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isFound ? 'No matching keywords detected.' : 'Great coverage — few suggestions remaining.'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Motion.span
              key={`${variant}-${keyword}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${tagClass}`}
            >
              {keyword}
            </Motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KeywordSuggestions({ keywordsFound, keywordsMissing }) {
  const displayFound = (keywordsFound || []).slice(0, 40);
  const displayMissing = (keywordsMissing || []).slice(0, 24);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TagCloud
        title="Found Keywords"
        keywords={displayFound}
        variant="found"
      />
      <TagCloud
        title="Suggested Keywords to Add"
        keywords={displayMissing}
        variant="missing"
      />
    </div>
  );
}
