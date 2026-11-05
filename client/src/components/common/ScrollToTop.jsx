import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/smoothScroll';

/** Jumps back to the top of the page whenever the route (pathname) changes. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return null;
}
