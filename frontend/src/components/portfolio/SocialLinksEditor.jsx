import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Button from '../Button'

// ─── Minimal stroke-based SVG icon helper (matches CustomSection pattern) ────

const Icon = ({ path, size = 16, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d={path} />
    </svg>
)

const ICONS = {
    plus: 'M12 5v14M5 12h14',
    trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    grip: 'M9 5h2M9 12h2M9 19h2M13 5h2M13 12h2M13 19h2',
    x: 'M18 6L6 18M6 6l12 12',
    arrowUp: 'M12 19V5M5 12l7-7 7 7',
    arrowDown: 'M12 5v14M19 12l-7 7-7-7',
    link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    alertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01',
}

// ─── Platform definitions ─────────────────────────────────────────────────────
// Each entry holds brand color, monogram initials, and placeholder URL.
// Icons are rendered as branded monogram badges to avoid external icon libraries.

const PLATFORM_DEFS = {
    github: {
        label: 'GitHub',
        color: '#24292e',
        initials: 'GH',
        placeholder: 'https://github.com/username',
    },
    linkedin: {
        label: 'LinkedIn',
        color: '#0077b5',
        initials: 'in',
        placeholder: 'https://linkedin.com/in/username',
    },
    twitter: {
        label: 'Twitter / X',
        color: '#000000',
        initials: '𝕏',
        placeholder: 'https://x.com/username',
    },
    youtube: {
        label: 'YouTube',
        color: '#ff0000',
        initials: '▶',
        placeholder: 'https://youtube.com/@channel',
    },
    dribbble: {
        label: 'Dribbble',
        color: '#ea4c89',
        initials: 'Dr',
        placeholder: 'https://dribbble.com/username',
    },
    behance: {
        label: 'Behance',
        color: '#1769ff',
        initials: 'Be',
        placeholder: 'https://behance.net/username',
    },
    medium: {
        label: 'Medium',
        color: '#000000',
        initials: 'M',
        placeholder: 'https://medium.com/@username',
    },
    devto: {
        label: 'Dev.to',
        color: '#0a0a0a',
        initials: 'DEV',
        placeholder: 'https://dev.to/username',
    },
    website: {
        label: 'Personal Website',
        color: '#6366f1',
        initials: '🌐',
        placeholder: 'https://yourwebsite.com',
    },
}

const DEFAULT_PLATFORM_ORDER = [
    'github', 'linkedin', 'twitter', 'youtube',
    'dribbble', 'behance', 'medium', 'devto', 'website',
]

// Build the default list of predefined links (all hidden, no URLs yet)
const makeDefaultLinks = () =>
    DEFAULT_PLATFORM_ORDER.map((platform) => ({
        id: crypto.randomUUID(),
        platform,
        url: '',
        enabled: false,
        icon: null, // null = use branded monogram badge; data-URL string = custom uploaded icon
    }))

// ─── URL validation ───────────────────────────────────────────────────────────

const isValidUrl = (raw) => {
    if (!raw.trim()) return true // empty is not an error
    try {
        const u = new URL(raw)
        return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
        return false
    }
}

// ─── Platform badge (monogram or uploaded icon) ───────────────────────────────

function PlatformBadge({ platform, customIcon, size = 28 }) {
    // User-uploaded custom icon takes priority
    if (customIcon) {
        return (
            <img
                src={customIcon}
                alt={platform || "Image"}
                style={{ width: size, height: size }}
                className="rounded-md object-contain shrink-0"
            />
        )
    }

    const def = PLATFORM_DEFS[platform]

    if (!def) {
        // Generic badge for fully custom platforms
        return (
            <div
                style={{ width: size, height: size }}
                className="rounded-md bg-muted flex items-center justify-center shrink-0"
            >
                <Icon path={ICONS.link} size={Math.round(size * 0.55)} className="text-muted-foreground" />
            </div>
        )
    }

    return (
        <div
            style={{ width: size, height: size, backgroundColor: `${def.color}22` }}
            className="rounded-md flex items-center justify-center shrink-0 select-none"
        >
            <span
                style={{ color: def.color, fontSize: Math.max(8, Math.round(size * 0.38)) }}
                className="font-black leading-none"
            >
                {def.initials}
            </span>
        </div>
    )
}

// ─── Single link row ──────────────────────────────────────────────────────────

function LinkRow({
    link,
    onChange,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    isDragging,
}) {
    const def = PLATFORM_DEFS[link.platform]
    const label =
        def?.label ??
        link.customLabel ??
        link.platform
    const placeholder = def?.placeholder ?? 'https://'

    // Validate only when a URL has been entered
    const urlError = link.url && !isValidUrl(link.url)
        ? 'Invalid URL — must start with https://'
        : null

    const fileRef = useRef(null)

    const handleUrlChange = (e) =>
        onChange({ ...link, url: e.target.value })

    const handleToggle = () =>
        onChange({ ...link, enabled: !link.enabled })

    // Read uploaded image as a data-URL so it persists without a server round-trip
    const handleIconUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (ev) => onChange({ ...link, icon: ev.target.result })
        reader.readAsDataURL(file)
        // Reset the input so the same file can be re-selected later
        e.target.value = ''
    }

    return (
        <div
            className={cn(
                'group border border-border/50 rounded-xl bg-card transition-all duration-200',
                isDragging && 'opacity-50 scale-[0.98] shadow-lg border-primary/40',
                link.enabled && !isDragging && 'border-primary/20',
            )}
        >
            {/* ── Row header ── */}
            <div className="flex items-center gap-2 px-3 py-2.5">
                {/* Drag grip — visible on hover */}
                <div
                    className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                    aria-hidden="true"
                >
                    <Icon path={ICONS.grip} size={14} className="text-muted-foreground" />
                </div>

                {/* Up / Down arrow buttons for keyboard-accessible reordering */}
                <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        aria-label={`Move ${label} up`}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                        <Icon path={ICONS.arrowUp} size={11} />
                    </button>
                    <button
                        type="button"
                        onClick={onMoveDown}
                        disabled={isLast}
                        aria-label={`Move ${label} down`}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                        <Icon path={ICONS.arrowDown} size={11} />
                    </button>
                </div>

                {/* Platform badge + label */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <PlatformBadge platform={link.platform} customIcon={link.icon} size={28} />
                    <span className="text-sm font-medium text-foreground truncate">{label}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                    {/* Custom icon upload */}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        aria-label={`Upload custom icon for ${label}`}
                        title="Upload custom icon"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Icon path={ICONS.upload} size={13} />
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIconUpload}
                        aria-label={`Custom icon for ${label}`}
                    />

                    {/* Show / hide toggle */}
                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-label={link.enabled ? `Hide ${label} from portfolio` : `Show ${label} on portfolio`}
                        title={link.enabled ? 'Visible on portfolio' : 'Hidden from portfolio'}
                        className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            link.enabled
                                ? 'text-primary hover:text-primary/70'
                                : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100',
                        )}
                    >
                        <Icon path={link.enabled ? ICONS.eye : ICONS.eyeOff} size={14} />
                    </button>

                    {/* Remove link */}
                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label={`Remove ${label}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Icon path={ICONS.trash} size={13} />
                    </button>
                </div>
            </div>

            {/* ── URL input ── */}
            <div className="px-3 pb-3">
                <div className="relative">
                    <input
                        type="url"
                        value={link.url}
                        onChange={handleUrlChange}
                        placeholder={placeholder}
                        aria-label={`${label} profile URL`}
                        aria-invalid={!!urlError}
                        aria-describedby={urlError ? `url-error-${link.id}` : undefined}
                        className={cn(
                            'w-full px-3 py-2 rounded-lg bg-background border text-sm text-foreground',
                            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors',
                            urlError
                                ? 'border-destructive/60 focus:ring-destructive/30 focus:border-destructive pr-8'
                                : 'border-border focus:ring-primary/40 focus:border-primary',
                            !link.enabled && 'opacity-50',
                        )}
                    />
                    {urlError && (
                        <div
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-destructive pointer-events-none"
                            aria-hidden="true"
                        >
                            <Icon path={ICONS.alertCircle} size={14} />
                        </div>
                    )}
                </div>
                {urlError && (
                    <p
                        id={`url-error-${link.id}`}
                        className="mt-1 text-xs text-destructive font-medium"
                        role="alert"
                    >
                        {urlError}
                    </p>
                )}
            </div>
        </div>
    )
}

// ─── Add custom link panel ────────────────────────────────────────────────────

function AddCustomPanel({ onAdd, onClose }) {
    const [label, setLabel] = useState('')
    const [url, setUrl] = useState('')

    const urlError = url && !isValidUrl(url)
        ? 'Invalid URL — must start with https://'
        : null

    const canSubmit = label.trim().length > 0 && !urlError

    const handleAdd = () => {
        if (!canSubmit) return
        onAdd({
            id: crypto.randomUUID(),
            platform: label.trim().toLowerCase().replace(/\s+/g, '_'),
            customLabel: label.trim(),
            url: url.trim(),
            enabled: !!url.trim(),
            icon: null,
        })
    }

    return (
        <div className="border border-border rounded-2xl bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-3.5 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Add Custom Link</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close panel"
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Icon path={ICONS.x} size={14} />
                </button>
            </div>

            <div className="px-5 py-4 space-y-3">
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Platform name <span className="text-destructive" aria-hidden="true">*</span>
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder="e.g. CodePen, Twitch, Substack…"
                        autoFocus
                        aria-required="true"
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        URL <span className="font-normal">(optional)</span>
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder="https://"
                        aria-invalid={!!urlError}
                        className={cn(
                            'w-full px-3 py-2 rounded-xl bg-background border text-sm text-foreground',
                            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors',
                            urlError
                                ? 'border-destructive/60 focus:ring-destructive/30'
                                : 'border-border focus:ring-primary/40 focus:border-primary',
                        )}
                    />
                    {urlError && (
                        <p className="mt-1 text-xs text-destructive font-medium" role="alert">
                            {urlError}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 pt-1">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAdd}
                        disabled={!canSubmit}
                        className="flex-1"
                    >
                        Add Link
                    </Button>
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─── Main exported component ──────────────────────────────────────────────────

/**
 * SocialLinksEditor
 *
 * Controlled component for managing a portfolio's social links.
 *
 * Props:
 *   value    – array of link objects (controlled); defaults to all predefined platforms
 *   onChange – callback(newLinks) called on every change
 *
 * Link shape:
 *   { id: string, platform: string, url: string, enabled: boolean, icon: string|null }
 */
export default function SocialLinksEditor({ value, onChange }) {
    // Fall back to a fresh default list when the parent hasn't supplied a value yet
    const links = value ?? makeDefaultLinks()

    const [showAddPanel, setShowAddPanel] = useState(false)

    // ── Drag-and-drop state ────────────────────────────────────────────────────
    const dragFromIdx = useRef(null)
    const [draggingId, setDraggingId] = useState(null)

    // ── Link helpers ───────────────────────────────────────────────────────────

    const updateLink = useCallback(
        (id, updated) => onChange(links.map((l) => (l.id === id ? updated : l))),
        [links, onChange],
    )

    const deleteLink = useCallback(
        (id) => onChange(links.filter((l) => l.id !== id)),
        [links, onChange],
    )

    const addLink = useCallback(
        (newLink) => onChange([...links, newLink]),
        [links, onChange],
    )

    const moveLink = useCallback(
        (idx, dir) => {
            const next = [...links]
            const target = idx + dir
            if (target < 0 || target >= next.length) return
                ;[next[idx], next[target]] = [next[target], next[idx]]
            onChange(next)
        },
        [links, onChange],
    )

    // ── Native HTML5 drag-and-drop ─────────────────────────────────────────────

    const handleDragStart = (e, idx) => {
        dragFromIdx.current = idx
        setDraggingId(links[idx].id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e, idx) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        const from = dragFromIdx.current
        if (from === null || from === idx) return
        // Perform a live swap so the list rearranges in real time while dragging
        const next = [...links]
            ;[next[from], next[idx]] = [next[idx], next[from]]
        dragFromIdx.current = idx
        onChange(next)
    }

    const handleDragEnd = () => {
        dragFromIdx.current = null
        setDraggingId(null)
    }

    const enabledCount = links.filter((l) => l.enabled && l.url).length

    return (
        <div className="space-y-4">
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-foreground">Social Links</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {enabledCount > 0
                            ? `${enabledCount} link${enabledCount !== 1 ? 's' : ''} visible on your portfolio`
                            : 'Toggle links to show them on your portfolio'}
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddPanel((v) => !v)}
                    className="gap-1.5"
                >
                    <Icon path={showAddPanel ? ICONS.x : ICONS.plus} size={13} />
                    {showAddPanel ? 'Cancel' : 'Add Custom'}
                </Button>
            </div>

            {/* ── Add custom link panel ── */}
            {showAddPanel && (
                <AddCustomPanel
                    onAdd={(newLink) => {
                        addLink(newLink)
                        setShowAddPanel(false)
                    }}
                    onClose={() => setShowAddPanel(false)}
                />
            )}

            {/* ── Empty state ── */}
            {links.length === 0 && !showAddPanel && (
                <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-border text-center">
                    <span className="text-3xl mb-2">🔗</span>
                    <p className="text-sm text-muted-foreground">No social links yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Click <strong>Add Custom</strong> to get started.
                    </p>
                </div>
            )}

            {/* ── Drag-and-drop hint ── */}
            {links.length > 1 && (
                <p className="text-xs text-muted-foreground -mb-1">
                    Drag rows or use the arrows to reorder. Toggle the eye icon to show/hide.
                </p>
            )}

            {/* ── Link list ── */}
            <div className="space-y-2" role="list" aria-label="Social links">
                {links.map((link, idx) => (
                    <div
                        key={link.id}
                        role="listitem"
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                    >
                        <LinkRow
                            link={link}
                            onChange={(updated) => updateLink(link.id, updated)}
                            onDelete={() => deleteLink(link.id)}
                            onMoveUp={() => moveLink(idx, -1)}
                            onMoveDown={() => moveLink(idx, 1)}
                            isFirst={idx === 0}
                            isLast={idx === links.length - 1}
                            isDragging={draggingId === link.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
