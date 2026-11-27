import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Cpu, Plus, Search } from "lucide-react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";
import FAB from "./FAB";
import NotificationCenter from "./NotificationCenter";
import MissingApiKeyModal from "./settings/MissingApiKeyModal";
import { cn } from "../lib/utils";
import { getActiveNavContext, QUICK_CREATE_ACTIONS } from "../constants/navigation";
import { useAIConfigStore, PROVIDER_META } from "../stores/useAIConfigStore";

function WorkspaceHeader() {
    const location = useLocation();
    const { group, item } = getActiveNavContext(location.pathname);
    const activeProvider = useAIConfigStore((s) => s.activeProvider);
    const activeMeta = activeProvider ? PROVIDER_META[activeProvider] : null;

    const [createOpen, setCreateOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setCreateOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!createOpen) return undefined;
        const onKeyDown = (e) => {
            if (e.key === "Escape") setCreateOpen(false);
        };
        const onMouseDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setCreateOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onMouseDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onMouseDown);
        };
    }, [createOpen]);

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
            {/* Left: Suite & Active Page Breadcrumb */}
            <div className="flex min-w-0 items-center gap-2 text-sm">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 font-semibold tracking-tight text-foreground md:hidden"
                >
                    <img src="/logo.png" alt="careerpilot" className="h-6 w-6 object-contain" />
                    <span className="sr-only sm:not-sr-only">careerpilot</span>
                </Link>
                <span className="text-border md:hidden" aria-hidden="true">/</span>

                <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs sm:text-[13px]">
                    <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline-flex">
                        {group.stage && (
                            <span className="text-primary">{group.stage}</span>
                        )}
                        {group.label}
                    </span>
                    <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 sm:block" aria-hidden="true" />
                    <span className="truncate font-semibold text-foreground">{item.label}</span>
                </nav>
            </div>

            {/* Right: Command Search, AI Status, Quick Create, Notifications */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("cp:open-command-palette"))}
                    className="hidden h-8 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
                    aria-label="Open quick command search"
                >
                    <Search className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Jump to tool</span>
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        ⌘K
                    </kbd>
                </button>

                <Link
                    to="/settings"
                    className="hidden h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground lg:inline-flex"
                    title="Configure AI Provider"
                >
                    <Cpu className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span className="max-w-[110px] truncate">
                        {activeMeta ? activeMeta.name : "Configure AI"}
                    </span>
                </Link>

                {/* Quick Create Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setCreateOpen((v) => !v)}
                        aria-expanded={createOpen}
                        aria-haspopup="menu"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                    >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">New</span>
                        <ChevronDown className={cn("h-3 w-3 transition-transform", createOpen && "rotate-180")} aria-hidden="true" />
                    </button>

                    {createOpen && (
                        <div
                            role="menu"
                            aria-label="Quick create"
                            className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl"
                        >
                            <p className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Quick actions
                            </p>
                            {QUICK_CREATE_ACTIONS.map((action) => (
                                <Link
                                    key={action.to}
                                    to={action.to}
                                    role="menuitem"
                                    onClick={() => setCreateOpen(false)}
                                    className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
                                >
                                    <action.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-foreground">{action.label}</p>
                                        <p className="truncate text-[11px] text-muted-foreground">{action.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <NotificationCenter />
            </div>
        </header>
    );
}

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            {/* The main tag below is what the FAB component listens to for scrolling */}
            <main ref={mainRef} className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
                <WorkspaceHeader />
                {children}
                <FAB scrollContainerRef={mainRef} />
            </main>
            <MobileNav />
            <MissingApiKeyModal />
        </div>
    );
}
