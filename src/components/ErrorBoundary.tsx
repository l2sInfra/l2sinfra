import { Component, type ErrorInfo, type ReactNode } from "react";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/site-contact";

interface Props {
  children: ReactNode;
  /** Shown instead of the default panel — used to keep the admin shell alive. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Without this, any render-time or event-handler throw unmounts the whole tree
 * and leaves the visitor looking at an empty page. On a site whose only job is
 * generating enquiries, a blank screen is a lost customer and no signal that
 * anything went wrong.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Console only — no error tracker is wired up yet.
    console.error("Unhandled error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Something went wrong at our end
          </h1>
          <p className="text-muted-foreground mb-8">
            This page didn't load properly. Reloading usually fixes it — and if you
            were trying to reach us, please just call.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              Reload the page
            </button>
            <a
              href={`tel:${PHONE_E164}`}
              className="border border-border text-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:border-gold-ink hover:text-gold-ink transition-colors"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
