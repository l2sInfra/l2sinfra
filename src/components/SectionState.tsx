import { AlertCircle } from "lucide-react";

/**
 * The designed error state every data-backed section was missing. Copy rule:
 * say plainly what happened, never blame the visitor, offer one recovery.
 */
export function SectionError({ onRetry, what }: { onRetry: () => void; what: string }) {
  return (
    <div className="text-center py-12 border border-border rounded-2xl bg-card">
      <AlertCircle size={24} className="text-gold-ink mx-auto mb-3" aria-hidden="true" />
      <p className="text-foreground font-medium mb-1">We couldn't load {what}</p>
      <p className="text-muted-foreground text-sm mb-6">
        This is on us, not you. It usually clears on a second try.
      </p>
      <button
        onClick={onRetry}
        className="border border-border text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-gold-ink hover:text-gold-ink transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

/** Shown when the query succeeded and genuinely returned nothing. */
export function SectionEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-12 border border-border rounded-2xl bg-card">
      <p className="text-muted-foreground text-sm max-w-md mx-auto">{children}</p>
    </div>
  );
}
