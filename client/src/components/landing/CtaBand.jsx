import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="border-t border-line/60 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
          {/* Glows */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-xl -translate-x-1/2 rounded-full bg-brand/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Stop wondering what's for dinner.{" "}
              <span className="text-accent">Plan it.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Create an account in a minute and build your first weekly plan
              today.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="btn-accent px-6 py-3 text-base">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
