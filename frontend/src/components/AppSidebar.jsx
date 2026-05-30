import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ChevronDown } from "lucide-react";

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
    Zap,
    Rocket,
    Briefcase,
    GitMerge
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
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
        label: "Project Visualizer",
        href: "/project-visualizer",
        icon: <GitMerge className="w-5 h-5 shrink-0" />,
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
    const [openRouterKey, setOpenRouterKey] = useState(null);

    useEffect(() => {
        setOpenRouterKey(localStorage.getItem('openRouterApiKey'));
    }, []);

    const handleOpenRouterConnect = async () => {
        if (openRouterKey) {
            localStorage.removeItem('openRouterApiKey');
            setOpenRouterKey(null);
            return;
        }

        const verifier = generateRandomString();
        sessionStorage.setItem('or_code_verifier', verifier);
        const challenge = await generateCodeChallenge(verifier);
        
        const callbackUrl = `${window.location.origin}/auth/openrouter/callback`;
        const openRouterUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl)}&code_challenge=${challenge}&code_challenge_method=S256`;
        
        window.location.href = openRouterUrl;
    };

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
                {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold whitespace-pre"
                >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
            </button>
            <button
                onClick={handleOpenRouterConnect}
                className={cn(
                    "flex items-center gap-3 w-full py-3 px-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer font-bold",
                    !open && animate && "justify-center"
                )}
            >
                <Zap className={cn("w-5 h-5 shrink-0", openRouterKey && "text-indigo-500")} />
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold whitespace-pre"
                >
                    {openRouterKey ? 'OpenRouter Connected' : 'Connect OpenRouter'}
                </motion.span>
            </button>
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
const location = useLocation();

useEffect(() => {
    setOpen(false);
}, [location.pathname]);

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-6 bg-card border-r border-border">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <Logo />
                    <SidebarDivider />
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
                <UserSection />
            </SidebarBody>
        </Sidebar>
    );
}