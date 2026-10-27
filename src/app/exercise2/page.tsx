import Link from "next/link";
import { getFixedRangeConfiguration } from "@/app/api/range/configurations";
import RangeDemo from "@/components/RangeDemo";

export default async function ExerciseTwoPage() {
  const initialConfiguration = await getFixedRangeConfiguration();

  return (
    <main className="flex-1 bg-slate-50 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto mb-10 max-w-3xl">
        <Link
          className="text-sm font-medium text-slate-500 transition hover:text-indigo-700"
          href="/"
        >
          ← All exercises
        </Link>
      </div>
      <RangeDemo
        mode="fixed"
        initialConfiguration={initialConfiguration}
      />
    </main>
  );
}
