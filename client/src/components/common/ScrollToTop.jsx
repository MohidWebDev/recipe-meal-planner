import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { rememberPage } from "../../utils/returnTo";
import { scrollToTop } from "../../utils/smoothScroll";

/** Jumps back to the top of the page whenever the route changes, and remembers the current page. */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  useEffect(() => {
    rememberPage({ pathname, search });
  }, [pathname, search]);

  return null;
}
