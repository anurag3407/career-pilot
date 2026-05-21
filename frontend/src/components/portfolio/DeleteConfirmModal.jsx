import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  portfolioTitle,
  isDeployed,
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity duration-300"
        onClick={isDeleting ? null : onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-2xl transition-all scale-100 dark:bg-secondary-bg">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Confirm Portfolio Deletion
            </h3>
            <p className="text-xs text-muted-foreground">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 mb-6">
          <p className="text-sm text-foreground/90">
            Are you sure you want to delete the portfolio <span className="font-semibold text-primary">"{portfolioTitle}"</span>?
          </p>

          {isDeployed && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-1">
                  Active Deployment Warning
                </h4>
                <p className="text-xs text-destructive-foreground/90 leading-relaxed dark:text-red-400">
                  This portfolio is currently live. Deleting it will take the site offline immediately and remove all hosted links.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end items-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-bold shadow-lg shadow-destructive/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50 min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
