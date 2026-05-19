import AppSidebar from "./AppSidebar";
import FAB from "./FAB";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <AppSidebar />
            {/* The main tag below is what the FAB component listens to for scrolling */}
            <main className="flex-1 overflow-y-auto relative">
                {children}
                <FAB />
            </main>
        </div>
    );
}