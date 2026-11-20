/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppToast } from '../../game/toasts.ts';
import { Award, Sparkles, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: AppToast[];
  onDismiss: (id: string) => void;
  onBadgeClick?: () => void;
  topOffsetClass?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onBadgeClick,
  topOffsetClass = 'top-24',
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      dir="auto"
      className={`fixed ${topOffsetClass} right-4 z-[70] pointer-events-none flex flex-col gap-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] select-none`}
      aria-live="polite"
      aria-label="Achievement Notifications"
    >
      {toasts.map((toast) => {
        const isBadge = toast.kind === 'badge';
        return (
          <div
            key={toast.id}
            role="status"
            data-testid="achievement-toast"
            data-toast-kind={toast.kind}
            onClick={() => {
              if (isBadge && onBadgeClick) {
                onBadgeClick();
              }
              onDismiss(toast.id);
            }}
            className={`pointer-events-auto rounded-2xl border px-4 py-3.5 shadow-xl backdrop-blur-md flex items-center gap-3.5 transition-all duration-200 animate-in fade-in slide-in-from-right-4 ${
              isBadge
                ? 'bg-slate-900/95 border-amber-400/65 hover:border-amber-300 shadow-[0_8px_24px_rgba(245,158,11,0.18)] cursor-pointer'
                : 'bg-slate-900/95 border-cyan-400/65 hover:border-cyan-300 shadow-[0_8px_24px_rgba(6,182,212,0.18)] cursor-pointer'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                isBadge
                  ? 'bg-amber-500/15 border-amber-400/45 text-amber-300'
                  : 'bg-cyan-500/15 border-cyan-400/45 text-cyan-300'
              }`}
            >
              {isBadge ? <Award className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className={`text-xs font-extrabold uppercase tracking-wider leading-none mb-1 ${
                  isBadge ? 'text-amber-300' : 'text-cyan-300'
                }`}
              >
                {toast.eyebrow}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white leading-snug truncate">
                {toast.title}
              </div>
              <div className="text-sm text-slate-200 leading-snug line-clamp-2 mt-0.5">
                {toast.subtitle}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
              aria-label={`Dismiss ${toast.title} notification`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
