import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Globe,
    User,
    Menu,
    Settings,
    X,
} from "lucide-react";
import { cn } from "../lib/utils";

const defaultTabs = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/hub/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/hub/resume", icon: FileText, label: "Resume" },
    { to: "/hub/portfolio", icon: Globe, label: "Portfolio" },
    { to: "/profile", icon: User, label: "Profile" },
];

const secondaryLinks = [
    { to: "/settings", icon: Settings, label: "Settings" },
];

function MobileNavItem({ item, onClick, drawerItem = false }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 font-semibold shadow-sm" 
                    : "border border-transparent hover:bg-muted/50 hover:text-foreground",
                drawerItem
                    ? "flex-row justify-start gap-3 px-4 py-3 text-sm font-medium w-full"
                    : "flex-col gap-1 px-1 text-[11px] font-medium leading-none"
            )}
        >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className={cn(!drawerItem && "truncate")}>{item.label}</span>
        </NavLink>
    );
}

export default function MobileNav({
    tabs = defaultTabs,
    menuLinks = secondaryLinks,
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <>
            <nav
                aria-label="Mobile navigation"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
            >
                <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMenuOpen}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground transition-all duration-200 border border-transparent hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="grid grid-cols-5 gap-1.5">
                        {tabs.slice(0, 5).map((item) => (
                            <MobileNavItem
                                key={item.to || item.label}
                                item={item}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute inset-0 h-full w-full bg-foreground/40 backdrop-blur-sm transition-opacity"
                    />

                    <aside
                        aria-label="Secondary navigation"
                        className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto border-t border-border bg-background px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl rounded-t-2xl"
                    >
                        <div className="flex min-h-11 items-center justify-between">
                            <h2 className="text-base font-semibold text-foreground">Menu</h2>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Close menu"
                                className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground transition-all duration-200 border border-transparent hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-3 grid gap-1.5">
                            {menuLinks.map((item) => (
                                <MobileNavItem
                                    key={item.to || item.label}
                                    item={item}
                                    drawerItem
                                    onClick={() => setIsMenuOpen(false)}
                                />
                            ))}
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}