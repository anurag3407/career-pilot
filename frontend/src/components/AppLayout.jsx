import { useRef } from "react";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";
import FAB from "./FAB";
import NotificationCenter from "./NotificationCenter";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <div className="hidden md:block">
    <AppSidebar />
</div>

            {/* The main tag below is what the FAB component listens to for scrolling */}
              <main ref={mainRef} className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
                {/* Top bar with notification bell */}
                <div className="sticky top-0 z-40 flex justify-end items-center px-4 py-2 bg-background/80 backdrop-blur border-b border-border">
                    <NotificationCenter />
                </div>
                {children}

                <FAB scrollContainerRef={mainRef} />
            </main>
            <MobileNav />
        </div>
    );
}