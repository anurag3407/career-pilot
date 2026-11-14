import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Briefcase,
  Code2,
  Eye,
  EyeOff,
  FolderGit2,
  GraduationCap,
  GripVertical,
  Layers,
  Link2,
  Mail,
  MessageSquareQuote,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
} from 'lucide-react';
import { SECTION_TYPES, SECTION_TYPE_MAP } from './portfolioDocument';

const ICONS = {
  hero: User,
  about: Sparkles,
  stats: TrendingUp,
  projects: FolderGit2,
  skills: Code2,
  experience: Briefcase,
  education: GraduationCap,
  testimonials: MessageSquareQuote,
  contact: Mail,
  socials: Link2,
};

const ADDABLE = SECTION_TYPES.filter((type) => type.type !== 'hero');

function sectionSummary(type, doc, section) {
  switch (type) {
    case 'hero':
      return doc.personal.name || 'Name and pitch';
    case 'about':
      return doc.personal.bio ? `${doc.personal.bio.length} characters` : 'Your story';
    case 'stats':
      return `${doc.stats.length} highlight${doc.stats.length === 1 ? '' : 's'}`;
    case 'projects':
      return `${doc.projects.length} project${doc.projects.length === 1 ? '' : 's'}`;
    case 'skills':
      return `${doc.skills.length} skill${doc.skills.length === 1 ? '' : 's'}`;
    case 'experience':
      return `${doc.experience.length} role${doc.experience.length === 1 ? '' : 's'}`;
    case 'education':
      return `${doc.education.length} entr${doc.education.length === 1 ? 'y' : 'ies'}`;
    case 'testimonials':
      return `${doc.testimonials.length} quote${doc.testimonials.length === 1 ? '' : 's'}`;
    case 'contact':
      return doc.contact.email || 'Contact details';
    case 'socials':
      return 'External links';
    case 'custom':
      return `${doc.custom.find((entry) => entry.id === section.customId)?.items?.length || 0} item(s)`;
    default:
      return '';
  }
}

export default function SectionsPanel({
  doc,
  activeSectionId,
  onSelect,
  onReorder,
  onToggle,
  onRemove,
  onAddCustom,
  onAddSection,
}) {
  const [addOpen, setAddOpen] = useState(false);
  const sections = doc.pf.sections;
  const availableToAdd = ADDABLE.filter(
    (type) => !sections.some((section) => section.type === type.type),
  );

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Sections</h2>
            <p className="text-[11px] text-muted-foreground">Drag to reorder · click to edit</p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen((value) => !value)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-semibold text-foreground hover:border-primary/50"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        {addOpen && (
          <div className="mt-2 space-y-1 rounded-lg border border-border bg-background p-1.5">
            {availableToAdd.map((type) => {
              const Icon = ICONS[type.type] || Layers;
              return (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => {
                    onAddSection(type.type);
                    setAddOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-muted"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {type.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                onAddCustom();
                setAddOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-primary hover:bg-primary/10"
            >
              <Layers className="h-3.5 w-3.5" /> Custom section
            </button>
            {availableToAdd.length === 0 && (
              <p className="px-2 py-1 text-[11px] text-muted-foreground">All standard sections are already on the page.</p>
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pf-sections">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
                {sections.map((section, index) => {
                  const type = SECTION_TYPE_MAP[section.type];
                  const Icon = ICONS[section.type] || Layers;
                  const active = activeSectionId === section.id;
                  return (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(dragProvided, snapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`group rounded-lg border transition ${
                            active
                              ? 'border-primary/60 bg-primary/5'
                              : snapshot.isDragging
                                ? 'border-primary/40 bg-card shadow-lg'
                                : 'border-transparent bg-background/40 hover:border-border'
                          } ${section.visible ? '' : 'opacity-60'}`}
                        >
                          <div className="flex items-center gap-1 px-1.5 py-1.5">
                            <span
                              {...dragProvided.dragHandleProps}
                              className="cursor-grab rounded p-1 text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
                              aria-label={`Reorder ${type?.label || section.type}`}
                            >
                              <GripVertical className="h-3.5 w-3.5" />
                            </span>
                            <button
                              type="button"
                              onClick={() => onSelect(section)}
                              className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left"
                            >
                              <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-foreground">
                                  {section.type === 'custom'
                                    ? doc.custom.find((entry) => entry.id === section.customId)?.title || 'Custom section'
                                    : type?.label || section.type}
                                </span>
                                <span className="block truncate text-[10px] text-muted-foreground">
                                  {sectionSummary(section.type, doc, section)}
                                </span>
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggle(section.id)}
                              aria-label={section.visible ? 'Hide section' : 'Show section'}
                              title={section.visible ? 'Hide on the page' : 'Show on the page'}
                              className="rounded p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-foreground focus:opacity-100"
                            >
                              {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            </button>
                            {section.type === 'custom' && (
                              <button
                                type="button"
                                onClick={() => onRemove(section)}
                                aria-label="Delete custom section"
                                className="rounded p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive focus:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {sections.some((section) => !section.visible) && (
          <p className="mt-3 rounded-lg bg-muted/60 px-2.5 py-2 text-[10px] leading-snug text-muted-foreground">
            Hidden sections stay in your document — turn the eye back on to restore them.
          </p>
        )}
      </div>
    </div>
  );
}
