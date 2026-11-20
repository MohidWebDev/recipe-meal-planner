import { Link, useLocation } from "react-router-dom";
import DemoButton from "./DemoButton";

/** Shown instead of a page's content when a logged-out visitor opens it. */
export default function AuthGate({ icon: Icon, title, message }) {
  const location = useLocation();

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center py-10 text-center sm:py-16">
      <div className="card w-full p-8 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>

        <h1 className="mt-5 text-2xl font-bold text-fg sm:text-3xl">{title}</h1>
        <p className="mt-3 text-muted">{message}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            state={{ from: location }}
            className="btn-accent px-6 py-3"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            state={{ from: location }}
            className="btn-secondary px-6 py-3"
          >
            Log in
          </Link>
        </div>

        <p className="mt-5 text-sm text-muted">
          Just looking around?{" "}
          <DemoButton className="link inline-flex items-center gap-1.5 font-medium" />
        </p>
      </div>
    </section>
  );
}
