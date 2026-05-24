import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                "h-full px-3 py-4 hidden md:flex md:flex-col bg-card border-r border-border w-[280px] flex-shrink-0 overflow-x-hidden",
                className
            )}
            animate={{
                width: animate ? (open ? "280px" : "80px") : "280px",
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            <div
                className={cn(
                    "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-border w-full"
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    <Menu
                        className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className={cn(
                                "fixed h-full w-full inset-0 bg-background p-6 z-[100] flex flex-col justify-between",
                                className
                            )}
                        >
                            <div
                                className="absolute right-6 top-6 z-50 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => setOpen(!open)}
                            >
                                <X className="w-6 h-6" />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({
    link,
    className,
    active,
    onClick,
    ...props
}) => {
    const { open, animate } = useSidebar();
    const location = useLocation();
    const isActive = active !== undefined ? active : location.pathname === link.href;

    return (
        <Link
            to={link.href}
            onClick={onClick}
            className={cn(
                "nav-link w-full group/sidebar transition-all duration-200",
                !open && animate ? "justify-center px-0" : "justify-start px-3",
                isActive ? "nav-link-active" : "nav-link-inactive",
                className
            )}
            {...props}
        >
            <div className="flex-shrink-0">
                {link.icon}
            </div>
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="text-sm font-medium whitespace-pre"
            >
                {link.label}
            </motion.span>
        </Link>
    );
};

export const SidebarDivider = () => {
    const { open, animate } = useSidebar();
    return (
        <motion.div
            animate={{
                opacity: animate ? (open ? 1 : 0.3) : 1,
            }}
            className="h-px bg-border my-4"
        />
    );
};
