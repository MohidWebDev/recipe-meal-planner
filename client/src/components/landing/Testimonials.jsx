import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

// SAMPLE CONTENT: replace with real feedback from real users before launch.
const TESTIMONIALS = [
  {
    quote:
      "I used to rewrite the same grocery list every Sunday. Now I plan the week in ten minutes and the list builds itself.",
    name: "Ayesha K.",
    role: "Home cook",
    tag: "Weeknight dinners",
    image: "/testimonials/1.webp",
  },
  {
    quote:
      "Merged ingredients are the best part. Two recipes with onions, and it is one line on my list.",
    name: "Bilal R.",
    role: "Student sharing a flat",
    tag: "Meal prep",
    image: "/testimonials/2.webp",
  },
  {
    quote:
      "We stopped asking what is for dinner at six in the evening. It is already on the grid.",
    name: "Sana & Omar",
    role: "Cooking for a family",
    tag: "Family cooking",
    image: "/testimonials/3.webp",
  },
  {
    quote:
      "All my favourite recipes live in one place now, instead of screenshots and bookmarks.",
    name: "Hira M.",
    role: "Recipe collector",
    tag: "Favourite recipes",
    image: "/testimonials/4.webp",
  },
];

// Lines the first card up with the page content, and lets the carousel run to the screen edge.
const EDGE = "max(1rem,calc((100vw_-_80rem)/2_+_1.5rem))";

export default function Testimonials() {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition duration-200 hover:border-accent/50 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-35";

  return (
    <section
      id="testimonials"
      className="border-t border-line/60 py-20 sm:py-24"
    >
      <Reveal className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="eyebrow">What people say</p>
          <h2 className="mt-3 text-3xl font-normal tracking-[-0.02em] sm:text-5xl">
            Planning that actually sticks.
          </h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={edges.start}
            className={arrowClass}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={edges.end}
            className={arrowClass}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <ul
          ref={trackRef}
          onScroll={updateEdges}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] sm:pr-6 [&::-webkit-scrollbar]:hidden"
          style={{ paddingLeft: EDGE, scrollPaddingLeft: EDGE }}
        >
          {TESTIMONIALS.map(({ quote, name, role, tag, image }) => (
            <li
              key={name}
              data-card
              className="w-[88%] shrink-0 snap-start sm:w-136 lg:w-184"
            >
              <figure className="card flex h-full flex-col gap-5 p-3 sm:min-h-72 sm:flex-row sm:gap-6 sm:p-4">
                <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-48 lg:w-56">
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-ink/60 px-3 py-1 font-nav text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-8 p-2 sm:py-3 sm:pr-4">
                  <blockquote className="text-lg leading-snug font-normal tracking-[-0.01em] text-fg lg:text-2xl">
                    “{quote}”
                  </blockquote>
                  <figcaption>
                    <p className="font-nav text-sm font-semibold text-fg">
                      {name}
                    </p>
                    <p className="mt-0.5 text-xs text-subtle">{role}</p>
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
