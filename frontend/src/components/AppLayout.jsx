import { useRef } from "react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";
import FAB from "./FAB";
import NotificationCenter from "./NotificationCenter";
import MissingApiKeyModal from "./settings/MissingApiKeyModal";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);

    const handleSkipClick = (e) => {
        e.preventDefault();
        mainRef.current?.focus();
        mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <a
                href="#main-content"
                onClick={handleSkipClick}
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:text-sm focus:font-medium"
            >
                Skip to content
            </a>
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            {/* The main tag below is what the FAB component listens to for scrolling */}
            <main
                ref={mainRef}
                id="main-content"
                tabIndex={-1}
                className="flex-1 overflow-y-auto relative pb-24 md:pb-0 focus:outline-none"
            >
                {/* Top bar with notification bell */}
                <div className="sticky top-0 z-40 flex justify-end items-center px-4 py-2 bg-background/80 backdrop-blur border-b border-border">
                    <NotificationCenter />
                </div>
                {children}

                <FAB scrollContainerRef={mainRef} />
            </main>
            <MobileNav />
            <MissingApiKeyModal />
        </div>
    );
}