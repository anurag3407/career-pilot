import { useRef } from "react";
import AppSidebar from "./AppSidebar";
import FAB from "./FAB";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);
    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <AppSidebar />
            {/* The main tag below is what the FAB component listens to for scrolling */}
            <main ref={mainRef} className="flex-1 overflow-y-auto relative">
                {children}
                <FAB scrollContainerRef={mainRef} />
            </main>
        </div>
    );
}