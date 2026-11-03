import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Logo from "@/components/logo";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffdf5] px-6 text-stone-900">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-6 flex justify-center">
          <Logo size={56} showText={false} href="/" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-800">
          <span>🧠</span>
          <span>Welcome to StickyBrain</span>
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
          Sticky<span className="text-orange-500">Brain</span>
        </h1>

        <p className="mt-3 text-lg font-medium text-stone-700">
          A little corner for big ideas and unfinished thoughts.
        </p>

        <p className="mt-4 text-base leading-relaxed text-stone-600">
          Pin thoughts to the wall, discover wild experiments from the community,
          react with emojis, and join threaded conversations.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ideas"
            className="rounded-full bg-stone-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-stone-700 shadow-sm"
          >
            Explore Idea Wall 💡
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              My Dashboard ({user.name})
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 transition hover:bg-stone-100"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 shadow-sm"
              >
                Join StickyBrain
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
