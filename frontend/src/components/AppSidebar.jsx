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
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
        label: "Security",
        href: "/security",
        icon: <ShieldCheck className="w-5 h-5 flex-shrink-0" />,
    },
];

function Logo() {
    const { open, animate } = useSidebar();

    return (
        <div className="flex items-center gap-3 py-2 px-1">
            <div className="w-12 h-8 flex-shrink-0 flex items-center justify-center">
                <img src="/speed.png" alt="careerpilot" className="w-12 h-8 object-contain" />
            </div>
            <motion.div
                animate={{
                    display: animate ? (open ? "flex" : "none") : "flex",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
            >
                <span className="text-xl font-bold text-white whitespace-pre">
                    careerpilot
                </span>
            </motion.div>
        </div>
    );
}

function UserSection() {
    const { user, logout } = useAuth();
    const { open, animate, setOpen } = useSidebar();
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
        <div className="space-y-2">
            <SidebarDivider />
            <div
                className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 transition-all",
                    !open && animate && "justify-center"
                )}
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{initials}</span>
                </div>
                <motion.div
                    animate={{
                        display: animate ? (open ? "block" : "none") : "block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                >
                    <p className="text-sm font-medium text-white truncate">
                        {displayName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                </motion.div>
            </div>
            <button
                onClick={() => {
                    handleLogout();
                    setOpen(false);
                }}
                className={cn(
                    "flex items-center gap-3 w-full py-3 px-3 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer",
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
                    className="text-sm font-medium whitespace-pre"
                >
                    Logout
                </motion.span>
            </button>
        </div>
    );
}

export default function AppSidebar() {
    const [open, setOpen] = useState(false);
    const { setOpen: setSidebarOpen } = { setOpen };

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-6 bg-black border-r border-neutral-800">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Logo />
                    <SidebarDivider />
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <SidebarLink
                                key={link.href}
                                link={link}
                                onClick={() => setOpen(false)}
                            />
                        ))}
                    </div>
                </div>
                <UserSection />
            </SidebarBody>
        </Sidebar>
    );
}
