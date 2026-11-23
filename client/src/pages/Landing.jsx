import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "../utils/smoothScroll";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import CtaBand from "../components/landing/CtaBand";
import Footer from "../components/common/Footer";
import BottomNav from "../components/common/BottomNav";

export default function Landing() {
  const { initializing } = useAuth();

  useEffect(() => {
    const previous = document.title;
    document.title = "Mealwise · Plan the week, shop once";
    return () => {
      document.title = previous;
    };
  }, []);

  const { state } = useLocation();
  const navigate = useNavigate();

  // Arrived from another page via a footer section link
  useEffect(() => {
    if (initializing || !state?.section) return;
    scrollToSection(state.section, { immediate: true });
    navigate("/", { replace: true, state: null }); // clear it so refresh/back doesn't re-scroll
  }, [state, initializing, navigate]);

  if (initializing) return <Loader fullScreen label="Loading…" />;

  return (
    <div
      id="top"
      className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn-accent"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <HowItWorks />
        <Features />
        <CtaBand />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
