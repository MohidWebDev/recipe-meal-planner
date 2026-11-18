import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";

const SECTION_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

export default function Landing() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) return <Loader fullScreen label="Loading…" />;

  // Logged-in users skip the marketing page and go straight to the app
  if (isAuthenticated) return <Navigate to="/recipes" replace />;

  return (
    <div id="top" className="min-h-screen">
      <Navbar sectionLinks={SECTION_LINKS} logoHref="#top" />
      <main>
        <Hero />
        <HowItWorks />
        {/* Step 5: <Features /> */}
        {/* Step 6: <CtaBand /> */}
      </main>
      {/* Step 6: <LandingFooter /> */}
    </div>
  );
}
