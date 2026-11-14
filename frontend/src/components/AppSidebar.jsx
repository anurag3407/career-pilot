import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Contrast, Bug, ShieldCheck, Sun, Moon, LogOut, Search } from "lucide-react";
import AIProviderIndicator from "./settings/AIProviderIndicator";
import ReportBugModal from "./ReportBugModal";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
    Sidebar,
    SidebarBody,
    SidebarLink,
    SidebarDivider,
} from "./ui/Sidebar";
import { useSidebar } from "../hooks/useSidebar";
import { cn } from "../lib/utils";
import { NAV_GROUPS, ACCOUNT_LINKS, isNavItemActive } from "../constants/navigation";

function Logo() {
    const { open, animate } = useSidebar();

    return (
        <div className={cn(
            "flex items-center gap-3 py-2 group",
            !open && animate ? "px-0 justify-center" : "px-1 justify-start"
        )}>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center p-1.5 rounded-xl group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="careerpilot" className="w-full h-full object-contain" />
            </div>
            <motion.div
                animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
            >
                <span className="text-xl font-bold text-foreground tracking-tight whitespace-pre">
                    careerpilot
                </span>
            </motion.div>
        </div>
    );
}

function NavGroup({ group, pathname, onNavigate, first }) {
    const { open, animate } = useSidebar();
    const collapsed = !open && animate;
    const items = group.items.filter((item) => item.primary);
    if (items.length === 0) return null;

    return (
        <div>
            {collapsed ? (
                !first && <div className="mx-2 my-2 h-px bg-border/60" aria-hidden="true" />
            ) : (
                <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                    {group.label}
                </p>
            )}
            <div className="flex flex-col gap-1">
                {items.map((item) => (
                    <SidebarLink
                        key={item.to}
                        link={{
                            label: item.label,
                            href: item.to,
                            icon: <item.icon className="w-5 h-5 shrink-0" />,
                        }}
                        active={isNavItemActive(pathname, item)}
                        onClick={onNavigate}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted font-semibold transition-all rounded-xl"
                    />
                ))}
            </div>
        </div>
    );
}

function UserSection() {
    const { user, logout } = useAuth();
    const { open, animate, setOpen } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (!user) return null;

    const displayName = user.displayName || user.email?.split("@")[0] || "User";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <div className="space-y-3">
            <SidebarDivider />
            <div
                className={cn(
                    "flex items-center gap-3 rounded-2xl bg-muted/50 border border-border transition-all hover:bg-muted",
                    !open && animate ? "p-2 justify-center" : "p-3"
                )}
            >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="text-primary font-bold text-base">{initials}</span>
                </div>
                <motion.div
                    animate={{
                        display: animate ? (open ? "block" : "none") : "block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                >
                    <p className="text-sm font-bold text-foreground truncate">
                        {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                </motion.div>
            </div>
            <button
                onClick={toggleTheme}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer",
                    !open && animate ? "px-0 justify-center" : "justify-start"
                )}
            >
                {theme === 'light' ? <Moon className="w-5 h-5 shrink-0" /> :
                    theme === 'dark' ? <Contrast className="w-5 h-5 shrink-0" /> :
                        <Sun className="w-5 h-5 shrink-0" />}
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold whitespace-pre"
                >
                    {theme === 'light' ? 'Dark Mode' :
                        theme === 'dark' ? 'High Contrast' :
                            'Light Mode'}
                </motion.span>
            </button>
            <AIProviderIndicator open={open} animate={animate} />
            <button
                onClick={() => {
                    handleLogout();
                    setOpen(false);
                }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 w-full cursor-pointer hover:text-destructive hover:bg-destructive/10",
                    !open && animate ? "px-0 justify-center" : "justify-start"
                )}
            >
                <LogOut className="w-5 h-5 shrink-0" />
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold whitespace-pre"
                >
                    Logout
                </motion.span>
            </button>
        </div>
    );
}

export default function AppSidebar({ animate = true }) {
    const [open, setOpen] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
    const location = useLocation();
    const { isAdmin } = useAuth();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const closeOnNavigate = () => setOpen(false);

    return (
        <>
            <Sidebar open={open} setOpen={setOpen} animate={animate}>
                <SidebarBody className="justify-between gap-4 bg-card border-r border-border overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <Logo />
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('cp:open-command-palette'))}
                            className={cn(
                                "mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
                                !open && animate ? "justify-center px-0" : "justify-start"
                            )}
                            aria-label="Search tools and pages"
                        >
                            <Search className="h-4 w-4 shrink-0" />
                            {(!animate || open) && (
                                <>
                                    <span className="flex-1 text-left text-[13px]">Quick search</span>
                                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
                                </>
                            )}
                        </button>
                        <SidebarDivider />
                        <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
                            {NAV_GROUPS.map((group, index) => (
                                <NavGroup
                                    key={group.id}
                                    group={group}
                                    pathname={location.pathname}
                                    onNavigate={closeOnNavigate}
                                    first={index === 0}
                                />
                            ))}
                            <NavGroup
                                group={{ id: 'account', label: 'Account', items: ACCOUNT_LINKS.map((l) => ({ ...l, primary: true })) }}
                                pathname={location.pathname}
                                onNavigate={closeOnNavigate}
                            />
                            {isAdmin && (
                                <NavGroup
                                    group={{
                                        id: 'admin',
                                        label: 'Admin',
                                        items: [{
                                            label: 'Admin Panel',
                                            to: '/admin',
                                            icon: ShieldCheck,
                                            primary: true,
                                            match: ['/admin'],
                                        }],
                                    }}
                                    pathname={location.pathname}
                                    onNavigate={closeOnNavigate}
                                />
                            )}
                        </nav>
                    </div>
                    <div className="shrink-0 space-y-2">
                        <button
                            onClick={() => setIsBugModalOpen(true)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 w-full cursor-pointer text-red-500 bg-red-500/10 hover:bg-red-500/20",
                                !open && animate ? "px-0 justify-center" : "justify-start"
                            )}
                        >
                            <Bug className="w-5 h-5 shrink-0" />
                            <motion.span
                                animate={{
                                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                                    opacity: animate ? (open ? 1 : 0) : 1,
                                }}
                                transition={{ duration: 0.2 }}
                                className="whitespace-pre"
                            >
                                Report a Bug
                            </motion.span>
                        </button>
                        <UserSection />
                    </div>
                </SidebarBody>
            </Sidebar>

            <ReportBugModal
                isOpen={isBugModalOpen}
                onClose={() => setIsBugModalOpen(false)}
            />
        </>
    );
}