import { useRef } from "react";
import AppSidebar from "./AppSidebar";
import FAB from "./FAB";
import NotificationCenter from "./NotificationCenter";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);
    
    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <AppSidebar />
            
            {/* Main content area container with reference for the FAB component */}
            <main ref={mainRef} className="flex-1 overflow-y-auto relative">
                
                {/* Top bar with notification bell */}
                <div className="sticky top-0 z-40 flex justify-end items-center px-4 py-2 bg-background/80 backdrop-blur border-b border-border">
                    <NotificationCenter />
                </div>

                {/* Page views render here */}
                {children}
                
                {/* Floating Action Button */}
                <FAB scrollContainerRef={mainRef} />
            </main>
        </div>
    );
}