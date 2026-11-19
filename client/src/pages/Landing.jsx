import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import CtaBand from "../components/landing/CtaBand";
import LandingFooter from "../components/landing/LandingFooter";

const SECTION_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

export default function Landing() {
  const { initializing } = useAuth();

  useEffect(() => {
    const previous = document.title;
    document.title = "Recipe & Meal Planner · Plan the week, shop once";
    return () => {
      document.title = previous;
    };
  }, []);

  if (initializing) return <Loader fullScreen label="Loading…" />;

  return (
    <div id="top" className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn-accent"
      >
        Skip to content
      </a>
      <Navbar sectionLinks={SECTION_LINKS} logoHref="#top" />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <HowItWorks />
        <Features />
        <CtaBand />
      </main>
      <LandingFooter />
    </div>
  );
}
