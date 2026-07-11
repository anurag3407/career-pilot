import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { SidebarContext } from "../../context/SidebarContext";

// Internal convenience — components within this file consume the context directly.
/**
 * Internal custom hook to retrieve the Sidebar context.
 * Throws an error if used outside a SidebarProvider.
 *
 * @returns {object} The Sidebar context object.
 */
function useSidebarInternal() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

/**
 * Context Provider component that wraps children and holds state for the Sidebar.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @param {boolean} [props.open] - Controlled open/close state.
 * @param {Function} [props.setOpen] - Callback function to update open state.
 * @param {boolean} [props.animate=true] - Whether to animate transition.
 * @returns {React.JSX.Element} The rendered Provider component.
 */
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

/**
 * Sidebar component that initializes the SidebarProvider context.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @param {boolean} [props.open] - Controlled open/close state.
 * @param {Function} [props.setOpen] - Callback function to update open state.
 * @param {boolean} [props.animate=true] - Whether to animate transition.
 * @returns {React.JSX.Element} The rendered Sidebar component.
 */
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

/**
 * Component that renders both Desktop and Mobile views of the Sidebar.
 *
 * @param {object} props - The component props.
 * @returns {React.JSX.Element} The rendered SidebarBody.
 */
export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    );
};

/**
 * Desktop sidebar component with expand/collapse animations on hover.
 *
 * @param {object} props - The component props.
 * @param {string} [props.className] - Extra class name custom styling.
 * @param {React.ReactNode} props.children - Child elements.
 * @returns {React.JSX.Element} The rendered DesktopSidebar.
 */
export const DesktopSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen, animate } = useSidebarInternal();
    return (
        <motion.div
            className={cn(
                "h-full px-3 py-4 hidden md:flex md:flex-col bg-card border-r border-border w-[280px] shrink-0 overflow-x-hidden",
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

/**
 * Mobile sidebar component with toggle menu bar and responsive slide-out drawer overlay.
 *
 * @param {object} props - The component props.
 * @param {string} [props.className] - Extra class name custom styling.
 * @param {React.ReactNode} props.children - Child elements.
 * @returns {React.JSX.Element} The rendered MobileSidebar.
 */
export const MobileSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen } = useSidebarInternal();
    return (
        <>
            <div
                className={cn(
                    "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-border w-full"
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    <button type="button"
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        aria-label={open ? "Close sidebar menu" : "Open sidebar menu"}
                        aria-expanded={open}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
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
                            <button type="button"
                                className="absolute right-6 top-6 z-50 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                onClick={() => setOpen(!open)}
                                aria-label="Close sidebar menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

/**
 * Navigation item link within the Sidebar.
 *
 * @param {object} props - The component props.
 * @param {object} props.link - The link item data (label, href, icon).
 * @param {string} [props.className] - Extra class name custom styling.
 * @param {boolean} [props.active] - Override active link styling status.
 * @param {Function} [props.onClick] - Click callback handler.
 * @returns {React.JSX.Element} The rendered SidebarLink.
 */
export const SidebarLink = ({
    link,
    className,
    active,
    onClick,
    ...props
}) => {
    const { open, animate } = useSidebarInternal();
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
            <div className="shrink-0">
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

/**
 * Divider line component that animates dynamically when Sidebar collapses.
 *
 * @returns {React.JSX.Element} The rendered SidebarDivider.
 */
export const SidebarDivider = () => {
    const { open, animate } = useSidebarInternal();
    return (
        <motion.div
            animate={{
                opacity: animate ? (open ? 1 : 0.3) : 1,
            }}
            className="h-px bg-border my-4"
        />
    );
};
