import { Link, useLocation } from "react-router-dom";
import { scrollToSection } from "../../utils/smoothScroll";

/**
 * Link to a section of the landing page.
 *  - On the landing page: scrolls smoothly, no URL change, no history entry.
 *  - On any other page: goes to the landing page, which then scrolls to the section.
 */
export default function SectionLink({ id, onClick, children, ...props }) {
  const { pathname } = useLocation();

  if (pathname !== "/") {
    return (
      <Link to="/" state={{ section: id }} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  const handleClick = (event) => {
    event.preventDefault();
    onClick?.();
    scrollToSection(id);
  };

  return (
    <a href={`#${id}`} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
