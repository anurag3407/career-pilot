import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Search,
    Bell,
    Mic,
    GraduationCap,
    Users,
    FileText,
    LogOut,
    Settings,
    Zap,
    User,
    ShieldCheck,
    Sun,
    Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
    Sidebar,
    SidebarBody,
    SidebarLink,
    SidebarDivider,
    useSidebar,
} from "./ui/Sidebar";
import { cn } from "../lib/utils";

const navLinks = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Find Jobs",
        href: "/jobs",
        icon: <Search className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Job Alerts",
        href: "/job-alerts",
        icon: <Bell className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Interview Prep",
        href: "/interview-prep",
        icon: <Mic className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Fellowship",
        href: "/fellowship",
        icon: <GraduationCap className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Community",
        href: "/community",
        icon: <Users className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Resume",
        href: "/upload",
        icon: <FileText className="w-5 h-5 flex-shrink-0" />,
    },
    {
        label: "Profile",
        href: "/profile",
        icon: <User className="w-5 h-5 flex-shrink-0" />,
        label: "Security",
        href: "/security",
        icon: <ShieldCheck className="w-5 h-5 flex-shrink-0" />,
     {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="w-5 h-5 flex-shrink-0" />,
    },
];

function Logo() {
    const { open, animate } = useSidebar();

    return (
        <div className="flex items-center gap-3 py-2 px-1 group">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center p-1.5 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform">
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
                    "flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border transition-all hover:bg-muted",
                    !open && animate && "justify-center"
                )}
            >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
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
                    "flex items-center gap-3 w-full py-3 px-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer font-bold",
                    !open && animate && "justify-center"
                )}
            >
                {theme === 'dark' ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold whitespace-pre"
                >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
            </button>
            <button
                onClick={() => {
                    handleLogout();
                    setOpen(false);
                }}
                className={cn(
                    "flex items-center gap-3 w-full py-3 px-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer font-bold",
                    !open && animate && "justify-center"
                )}
            >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold whitespace-pre"
                >
                    Logout
                </motion.span>
            </button>
        </div>
    );
}

export default function AppSidebar() {
    const [open, setOpen] = useState(false);

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
                </div>
                <UserSection />
            </SidebarBody>
        </Sidebar>
    );
}

