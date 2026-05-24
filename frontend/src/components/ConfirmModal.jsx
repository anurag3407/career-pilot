import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
}) {
    const cancelRef = useRef(null);
    useEffect(() => {
        if (isOpen && cancelRef.current) cancelRef.current.focus();
    }, [isOpen]);

    const variantStyles = {
        danger: { icon: 'bg-destructive/10 text-destructive border-destructive/20', button: 'bg-destructive hover:bg-destructive/90 text-white' },
        warning: { icon: 'bg-amber-500/10 text-amber-500 border-amber-500/20', button: 'bg-amber-500 hover:bg-amber-500/90 text-white' },
        info: { icon: 'bg-primary/10 text-primary border-primary/20', button: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
    };

    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
                    <motion.div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${styles.icon}`}><AlertTriangle className="w-6 h-6" /></div>
                        <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground mb-6">{message}</p>
                        <div className="flex items-center gap-3">
                            <button ref={cancelRef} onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-semibold border border-border hover:bg-muted/80 disabled:opacity-50">{cancelText}</button>
                            <button onClick={onConfirm} disabled={loading} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 ${styles.button}`}>
                                {loading ? 'Processing...' : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
