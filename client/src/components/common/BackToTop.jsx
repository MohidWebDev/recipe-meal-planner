import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scrollToTop } from '../../utils/smoothScroll';

/** Floating button that appears after scrolling down and glides back to the top. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTop()}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed right-5 bottom-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface/90 text-fg shadow-lg shadow-black/40 backdrop-blur transition duration-300 ease-out hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
