import Link from "next/link";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import IdeaWall from "./idea-wall";
import Logo from "@/components/logo";

export default async function IdeasPage() {
  const user = await getCurrentUser();

  const { rows: ideas } = await pool.query(`
    SELECT
      i.id,
      i.title,
      i.content,
      i.category,
      i.created_at,
      u.id AS author_id,
      u.name AS author_name
    FROM ideas i
    JOIN users u ON u.id = i.author_id
    ORDER BY i.created_at DESC, i.id DESC
    LIMIT 20
  `);

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* StickyBrain Top Navigation Bar */}
        <nav className="mb-10 flex items-center justify-between border-b border-stone-200/70 pb-5">
          <Logo size={36} href="/ideas" />

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              >
                Hi, {user.name.split(" ")[0]} 👤
              </Link>
            ) : (
              <>
                <Link
                  href="/login?next=%2Fideas"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-stone-700 transition hover:text-stone-900"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-sm text-amber-800">
            <span>✳</span>
            <span>A little corner for big ideas</span>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                The Sticky<span className="text-orange-500">Brain</span> Wall
              </h1>
              <p className="mt-3 max-w-lg text-stone-600">
                Half-baked thoughts, big dreams, wild experiments. Pin yours on
                the wall and see what others think.
              </p>
            </div>

            <Link
              href="/ideas/new"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-stone-700 shadow-sm"
            >
              <span className="text-xl">＋</span>
              Pin an idea
            </Link>
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">
            The idea wall <span className="text-stone-400">✳</span>
          </h2>
          <p className="text-sm text-stone-500">
            {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-6 py-16 text-center">
            <div className="text-5xl">📝</div>
            <h2 className="mt-5 text-2xl font-bold text-stone-900">
              This wall is waiting for you.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-stone-600">
              Every interesting thing starts somewhere. Pin the first idea and
              get the conversation going on StickyBrain.
            </p>
            <Link
              href="/ideas/new"
              className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700"
            >
              Add the first sticky note →
            </Link>
          </div>
        ) : (
          <IdeaWall
            ideas={ideas.map((idea) => ({
              ...idea,
              created_at: new Date(idea.created_at).toISOString(),
            }))}
          />
        )}

        <footer className="mt-16 border-t border-stone-200 py-6 text-center text-sm text-stone-500">
          StickyBrain — Made for curious minds and unfinished thoughts. ✳
        </footer>
      </div>
    </main>
  );
}
