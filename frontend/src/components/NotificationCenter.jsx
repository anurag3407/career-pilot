import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BriefcaseBusiness, Mail, XCircle, CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { cn } from "../lib/utils";

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_CONFIG = {
  job_alert_new_jobs:    { icon: BriefcaseBusiness, color: "text-primary",    bg: "bg-primary/10",     label: "New Jobs Found",   href: "/job-alerts" },
  job_alert_email_sent:  { icon: Mail,              color: "text-green-500",   bg: "bg-green-500/10",   label: "Alert Email Sent", href: "/job-alerts" },
  job_alert_email_failed:{ icon: XCircle,           color: "text-destructive", bg: "bg-destructive/10", label: "Email Failed",     href: "/job-alerts" },
  notification:          { icon: Bell,              color: "text-primary",     bg: "bg-primary/10",     label: "Notification",     href: "/dashboard"  },
};

function getTitle(notif) {
  if (notif.type === "job_alert_new_jobs")
    return `${notif.data?.jobCount} new job${notif.data?.jobCount > 1 ? "s" : ""} for "${notif.data?.alertTitle}"`;
  if (notif.type === "job_alert_email_sent")
    return `Email sent for "${notif.data?.alertTitle}"`;
  if (notif.type === "job_alert_email_failed")
    return `Email failed for "${notif.data?.alertTitle}"`;
  return notif.data?.message || TYPE_CONFIG.notification.label;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Read ALL notification state from the single source of truth: SocketContext
  const { notifications, unreadCount, markRead, markAllRead, dismissNotification } = useSocket();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (notif) => {
    markRead(notif.id);
    const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.notification;
    setOpen(false);
    navigate(config.href);
  };

  const handleDismiss = (e, id) => {
    e.stopPropagation();
    dismissNotification(id);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 max-h-[480px] flex flex-col rounded-2xl bg-card border border-border shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <span className="font-bold text-foreground text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Bell className="w-8 h-8 opacity-30" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs opacity-60">Job alerts will appear here in real-time</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.notification;
                  const Icon = config.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleClick(notif)}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/60 relative group",
                        !notif.read && "bg-primary/5"
                      )}
                    >
                      {/* Icon */}
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm leading-snug", notif.read ? "text-muted-foreground" : "text-foreground font-medium")}>
                          {getTitle(notif)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(notif.timestamp)}</p>
                      </div>
                      {/* Unread dot */}
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                      {/* Dismiss */}
                      <button
                        onClick={(e) => handleDismiss(e, notif.id)}
                        className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
