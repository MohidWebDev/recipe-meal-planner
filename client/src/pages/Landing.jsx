import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function Landing() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) return <Loader fullScreen label="Loading…" />;

  // Logged-in users skip the marketing page and go straight to the app
  if (isAuthenticated) return <Navigate to="/recipes" replace />;

  return (
    <div className="min-h-screen">
      {/* Step 2: <LandingNav /> */}
      <main>
        {/* Step 3: <Hero /> */}
        {/* Step 4: <HowItWorks /> */}
        {/* Step 5: <Features /> */}
        {/* Step 6: <CtaBand /> */}
        <section className="flex min-h-[70vh] items-center justify-center px-4 text-center">
          <div>
            <p className="eyebrow">Landing page</p>
            <h1 className="mt-3 text-4xl font-bold">Skeleton works</h1>
            <p className="mt-2 text-muted">
              Sections will appear here step by step.
            </p>
          </div>
        </section>
      </main>
      {/* Step 6: <LandingFooter /> */}
    </div>
  );
}
