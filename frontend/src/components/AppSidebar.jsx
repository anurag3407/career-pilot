import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ChevronDown, Contrast, LineChart, Bug } from "lucide-react";
import AIProviderIndicator from "./settings/AIProviderIndicator";
import ReportBugModal from "./ReportBugModal";

import {
    LayoutDashboard,
    Search,
    Bell,
    Mail,
    GraduationCap,
    Users,
    FileText,
    Globe,
    LogOut,
    Settings,
    User,
    ShieldCheck,
    Sun,
    Moon,
    Rocket,
    Briefcase,
    GitMerge
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
// PKCE utils kept for legacy OpenRouter OAuth callback compatibility
import { generateRandomString, generateCodeChallenge } from "../utils/pkce";
import {
    Sidebar,
    SidebarBody,
    SidebarLink,
    SidebarDivider,
} from "./ui/Sidebar";
import { useSidebar } from "../hooks/useSidebar";
import { cn } from "../lib/utils";

const navLinks = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
        label: "ATS Dashboard",
        href: "/ats-dashboard",
        icon: <LineChart className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Resume Builder",
        href: "/hub/resume",
        icon: <FileText className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Job Finder",
        href: "/hub/jobs",
        icon: <Briefcase className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Portfolio Builder",
        href: "/hub/portfolio",
        icon: <Globe className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Career Growth",
        href: "/hub/career",
        icon: <GraduationCap className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Community Hub",
        href: "/hub/community",
        icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Profile",
        href: "/profile",
        icon: <User className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Security",
        href: "/security",
        icon: <ShieldCheck className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="w-5 h-5 shrink-0" />,
    },
    {
        label: "Admin Panel",
        href: "/admin",
        icon: <ShieldCheck className="w-5 h-5 shrink-0 text-blue-500" />,
    }
];


function Logo() {
    const { open, animate } = useSidebar();

    return (
        <div className={cn(
            "flex items-center gap-3 py-2 group",
            !open && animate ? "px-0 justify-center" : "px-1 justify-start"
        )}>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center p-1.5 rounded-xl group-hover:scale-110 transition-transform">
                <img src="/speed.png" alt="careerpilot" className="w-full h-full object-contain" />
            </div>
            <motion.div
                animate={{
                    display: animate ? (open ? "flex" : "none") : "flex",
                    opacity: animate ? (open ? 1 : 0) : 1,
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

export default function AppSidebar() {
    const [open, setOpen] = useState(false);
    const [openAI, setOpenAI] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    return (
        <>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-4 bg-card border-r border-border overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <Logo />
                        <SidebarDivider />
                        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <SidebarLink
                                        key={link.href}
                                        link={link}
                                        onClick={() => setOpen(false)}
                                        className="text-muted-foreground hover:text-foreground hover:bg-muted font-semibold transition-all rounded-xl"
                                    />
                                ))}
                            </div>
                            {/* AI Tools Collapsible */}
                            <div className="mt-2">
                                <button
                                    onClick={() => setOpenAI(!openAI)}
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted font-semibold transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Brain className="w-5 h-5 shrink-0" />
                                        <span>AI Tools</span>
                                    </div>

                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-300",
                                            openAI && "rotate-180"
                                        )}
                                    />
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openAI ? "auto" : 0,
                                        opacity: openAI ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden ml-4 flex flex-col gap-1"
                                >
                                    <SidebarLink
                                        link={{
                                            label: "Cold Outreach",
                                            href: "/outreach",
                                            icon: <Mail className="w-4 h-4 shrink-0" />,
                                        }}
                                        onClick={() => setOpen(false)}
                                    />
                                    <SidebarLink
                                        link={{
                                            label: "Skill Gap Analyzer",
                                            href: "/skill-gap",
                                            icon: <Brain className="w-4 h-4 shrink-0" />,
                                        }}
                                        onClick={() => setOpen(false)}
                                    />

                                    <SidebarLink
                                        link={{
                                            label: "Career Trajectory",
                                            href: "/career-path",
                                            icon: <Brain className="w-4 h-4 shrink-0" />,
                                        }}
                                        onClick={() => setOpen(false)}
                                    />

                                    <SidebarLink
                                        link={{
                                            label: "Salary Estimator",
                                            href: "/salary-estimate",
                                            icon: <Brain className="w-4 h-4 shrink-0" />,
                                        }}
                                        onClick={() => setOpen(false)}
                                    />

                                    <SidebarLink
                                        link={{
                                            label: "Project Visualizer",
                                            href: "/project-visualizer",
                                            icon: <GitMerge className="w-4 h-4 shrink-0" />,
                                        }}
                                        onClick={() => setOpen(false)}
                                    />
                                </motion.div>
                            </div>
                        </div>
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
