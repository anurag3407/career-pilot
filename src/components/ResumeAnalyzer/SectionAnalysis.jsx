import { motion as Motion } from 'framer-motion';
import { CheckCircle2, XCircle, User, FileText, Briefcase, GraduationCap, Wrench, FolderKanban } from 'lucide-react';

const SECTION_ICONS = {
  'Contact Info': User,
  'Summary / Objective': FileText,
  'Work Experience': Briefcase,
  Education: GraduationCap,
  Skills: Wrench,
  Projects: FolderKanban,
};

function SectionList({ title, items, variant }) {
  const isDetected = variant === 'detected';
  const IconWrapper = isDetected ? CheckCircle2 : XCircle;
  const iconClass = isDetected ? 'text-green-400' : 'text-red-400';
  const borderClass = isDetected ? 'border-green-500/20' : 'border-red-500/20';
  const bgClass = isDetected ? 'bg-green-500/5' : 'bg-red-500/5';

  return (
    <div className={`rounded-2xl border p-5 ${borderClass} ${bgClass}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <IconWrapper className={`w-5 h-5 ${iconClass}`} />
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isDetected ? 'No sections detected yet.' : 'All key sections are present!'}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((section, index) => {
            const SectionIcon = SECTION_ICONS[section] || FileText;
            return (
              <Motion.li
                key={section}
                initial={{ opacity: 0, x: isDetected ? -8 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <SectionIcon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />
                <span>{section}</span>
              </Motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SectionAnalysis({ sections }) {
  if (!sections) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionList
        title="Detected Sections"
        items={sections.detected || []}
        variant="detected"
      />
      <SectionList
        title="Missing Sections"
        items={sections.missing || []}
        variant="missing"
      />
    </div>
  );
}
