import Link from "next/link";

const exercises = [
  {
    href: "/exercise1",
    eyebrow: "Exercise 01",
    title: "Continuous range",
    description:
      "Drag freely across a numeric domain and edit either endpoint.",
  },
  {
    href: "/exercise2",
    eyebrow: "Exercise 02",
    title: "Fixed values",
    description:
      "Select from curated price points with precise snap behavior.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 items-center bg-slate-50 px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Front-end exercise
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          A range input, built from the ground up.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Explore two accessible range-selection modes, each powered by a small
          mock service and a custom draggable control.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <Link
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              href={exercise.href}
              key={exercise.href}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                {exercise.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {exercise.title}
              </h2>
              <p className="mt-2 leading-6 text-slate-600">
                {exercise.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                Open exercise
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
