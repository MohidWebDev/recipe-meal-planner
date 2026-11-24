import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

// SAMPLE CONTENT: replace with real feedback from real users before launch.
const TESTIMONIALS = [
  {
    quote:
      "I used to rewrite the same grocery list every Sunday and still forget half of what I needed. Now I plan the whole week in about ten minutes, drop the recipes into the grid, and the shopping list builds itself. It has honestly taken the stress out of weeknight dinners for me.",
    name: "Ayesha K.",
    role: "Home cook",
    tag: "Weeknight dinners",
    image: "/testimonials/1.webp",
  },
  {
    quote:
      "Merged ingredients are the best part. When two recipes both need onions or rice, it shows up as one line on my list with the total amount, so I never buy double. Sharing a flat means every bit of budget counts, and this has cut down our food waste noticeably.",
    name: "Bilal R.",
    role: "Student sharing a flat",
    tag: "Meal prep",
    image: "/testimonials/2.webp",
  },
  {
    quote:
      "We stopped asking what is for dinner at six in the evening because the answer is already on the grid. Planning together on Sunday takes a few minutes, everyone can see what is coming up, and we waste far less food because we only buy what the week needs.",
    name: "Sana & Omar",
    role: "Cooking for a family",
    tag: "Family cooking",
    image: "/testimonials/3.webp",
  },
  {
    quote:
      "All my favourite recipes finally live in one place instead of screenshots, bookmarks and notes scattered across my phone. I can search by ingredient, adjust the quantities for guests, and add a dish to the week in a couple of taps. It feels like my own personal cookbook.",
    name: "Hira M.",
    role: "Recipe collector",
    tag: "Favourite recipes",
    image: "/testimonials/4.webp",
  },
  {
    quote:
      "I host brunch for friends most weekends, and the planner makes it easy. I add the recipes, scale the servings for the number of guests, and the shopping list tells me exactly what to pick up in one trip. No more last-minute runs to the store for a forgotten ingredient.",
    name: "Zain A.",
    role: "Weekend brunch host",
    tag: "Weekend brunch",
    image: "/testimonials/5.webp",
  },
];

// Lines the first card up with the page content (max-w-7xl + px-6) while the
// carousel itself still runs to the screen edges, so neighbouring cards peek in.
const EDGE_PADDING =
  "pl-4 scroll-pl-4 sm:pl-[max(1.5rem,calc((100vw_-_80rem)/2_+_1.5rem))] sm:scroll-pl-[max(1.5rem,calc((100vw_-_80rem)/2_+_1.5rem))]";

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
      ? card.getBoundingClientRect().width + 12
      : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-line-strong text-muted transition duration-200 hover:border-accent/50 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-35";

  return (
    <section
      id="testimonials"
      className="border-t border-line/60 py-20 sm:py-24"
    >
      <Reveal className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="flex items-center gap-2.5 font-nav text-xs text-muted">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="h-1 w-1 rounded-full bg-accent/60" />
              <span className="h-1 w-1 rounded-full bg-accent/30" />
            </span>
            Hear from our home cooks
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-[-0.02em] sm:text-5xl">
            Planning that actually sticks.
          </h2>
        </div>
        <div className="flex shrink-0 gap-2 pb-1.5">
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
          className={`mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 pb-2 scrollbar-none sm:pr-6 [&::-webkit-scrollbar]:hidden ${EDGE_PADDING}`}
        >
          {TESTIMONIALS.map(({ quote, name, role, tag, image }) => (
            <li
              key={name}
              data-card
              className="w-[85%] shrink-0 snap-start sm:w-120 lg:w-160"
            >
              <figure className="flex h-full flex-col gap-4 bg-overlay p-3 sm:min-h-64 sm:flex-row sm:gap-6">
                {/* Photo tile with the label centered on top, like a logo card */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-40 lg:w-44">
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-ink/60"
                    aria-hidden="true"
                  />
                  <p className="absolute inset-0 flex items-center justify-center px-4 text-center font-display text-xl leading-tight font-semibold text-balance text-accent">
                    {tag}
                  </p>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-8 py-1 sm:pr-6">
                  <blockquote className="font-display text-[15px] leading-[1.55] font-normal text-fg lg:text-base">
                    “{quote}”
                  </blockquote>
                  <figcaption>
                    <p className="font-nav text-xs font-semibold text-fg">
                      {name}
                    </p>
                    <p className="mt-1 text-xs text-subtle">{role}</p>
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
