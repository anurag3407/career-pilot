import { Link } from 'react-router-dom';
import { Settings, ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Seo from '../Seo';

export default function AuthNotConfigured({ mode }) {
  const isRegister = mode === 'register';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={`${isRegister ? 'Create account' : 'Sign in'} — CareerPilot`}
        description="Create a free CareerPilot account to use the resume, portfolio, interview, and job-search workspace."
      />
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center gap-6 px-6 pt-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
          <Settings className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isRegister ? 'Create your free account' : 'Welcome back'}
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Authentication is not configured in this preview. Explore the product pages and
            templates now; add <code className="rounded bg-muted px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code>{' '}
            to enable sign-in and account creation.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/templates"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse templates <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
