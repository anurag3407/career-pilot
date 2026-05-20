import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import FAB from "./FAB";
import NotificationCenter from "./NotificationCenter";
import { SidebarProvider } from "./ui/Sidebar";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    const mainRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Pages where FAB should be shown
    const showFABPaths = [
        "/dashboard",
        "/jobs",
        "/job-alerts",
        "/interview-prep",
        "/fellowship",
        "/community",
        "/upload",
        "/profile",
        "/security",
        "/settings",
        "/templates",
        "/job-tracker",
        "/email-generator",
        "/linkedin-optimizer"
    ];

    const shouldShowFAB = showFABPaths.includes(location.pathname);

    return (
        <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
            <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
                <AppSidebar />

                {/* Main Content */}
                <main ref={mainRef} className="flex-1 overflow-y-auto relative">

                    {/* Top bar with notification bell */}
                    <div className="sticky top-0 z-40 flex justify-end items-center px-4 py-2 bg-background/80 backdrop-blur border-b border-border">
                        <NotificationCenter />
                    </div>

                    {children}

                    {/* FAB - Only show on specific pages */}
                    {shouldShowFAB && <FAB scrollContainerRef={mainRef} />}
                </main>
            </div>
        </SidebarProvider>
    );
}