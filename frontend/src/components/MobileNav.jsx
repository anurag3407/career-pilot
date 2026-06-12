import { useEffect, useState } from "react";
import {
    Bell,
    CalendarDays,
    Home,
    Menu,
    Search,
    Settings,
    UserCircle,
    X,
} from "lucide-react";
import { cn } from "../lib/utils";

const primaryTabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Alerts", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/profile", icon: UserCircle },
];

const secondaryLinks = [
    { label: "Settings", href: "/settings", icon: Settings },
];

function getCurrentPath() {
    if (typeof window === "undefined") return "";
    return window.location.pathname;
}

function MobileNavItem({ item, activePath, onClick, drawerItem = false }) {
    const Icon = item.icon;
    const isActive = activePath === item.href;

    return (
        <a
            href={item.href}
            onClick={onClick}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "bg-accent text-accent-foreground",
                drawerItem
                    ? "flex-row justify-start gap-3 px-3 text-sm font-medium"
                    : "flex-col gap-1 px-1 text-[11px] font-medium leading-none"
            )}
        >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className={cn(!drawerItem && "truncate")}>{item.label}</span>
        </a>
    );
}

export default function MobileNav({
    tabs = primaryTabs,
    menuLinks = secondaryLinks,
    activePath = getCurrentPath(),
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
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
            >
                <div className="grid grid-cols-[44px_1fr] items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMenuOpen}
                        className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="grid grid-cols-5 gap-1">
                        {tabs.slice(0, 5).map((item) => (
                            <MobileNavItem
                                key={item.href || item.label}
                                item={item}
                                activePath={activePath}
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
                        className="absolute inset-0 h-full w-full bg-foreground/40"
                    />

                    <aside
                        aria-label="Secondary navigation"
                        className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto border-t border-border bg-background px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-lg"
                    >
                        <div className="flex min-h-11 items-center justify-between">
                            <h2 className="text-base font-semibold text-foreground">Menu</h2>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Close menu"
                                className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-2 grid gap-1">
                            {menuLinks.map((item) => (
                                <MobileNavItem
                                    key={item.href || item.label}
                                    item={item}
                                    activePath={activePath}
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