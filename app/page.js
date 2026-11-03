import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Logo from "@/components/logo";
import pool from "@/lib/db";

export default async function Home() {
  const user = await getCurrentUser();

  // Fetch count of ideas for live stats
  let totalIdeas = 0;
  try {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM ideas");
    totalIdeas = rows[0]?.count ?? 0;
  } catch {
    totalIdeas = 0;
  }

  return (
    <div className="relative min-h-screen bg-[#fffdf5] text-stone-900 selection:bg-orange-200">
      {/* Subtle tech dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(#78716c 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between py-6">
          <Logo size={38} href="/" />

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-1 font-mono text-xs text-stone-600 backdrop-blur-sm sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>{totalIdeas} ideas pinned</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-800 transition hover:bg-stone-50"
                >
                  Dashboard ({user.name.split(" ")[0]})
                </Link>
                <Link
                  href="/ideas/new"
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-700"
                >
                  Pin Idea ＋
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-bold text-stone-700 transition hover:text-stone-900"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-700 shadow-sm"
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center pt-12 pb-16 text-center sm:pt-20">
          {/* Fun tech badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 font-mono text-xs font-semibold text-orange-800 backdrop-blur-sm">
            <span>🧠</span>
            <span>A little corner for big ideas</span>
            <span className="text-orange-400">/</span>
            <span className="text-orange-600 font-bold">v1.0</span>
          </div>

          <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-stone-950 sm:text-6xl sm:leading-[1.1]">
            Where half-baked thoughts become{" "}
            <span className="relative inline-block text-orange-600 underline decoration-amber-400 decoration-wavy decoration-from-font">
              real things.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 sm:text-xl">
            No pitch decks. No formal slides. Just raw sticky-notes, quick
            feedback, emoji reactions, and community brains working together.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-900 bg-amber-300 px-7 py-3.5 font-bold text-stone-950 shadow-[4px_4px_0px_#1c1917] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1c1917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#1c1917]"
            >
              <span>Explore Idea Wall</span>
              <span className="text-lg">💡</span>
            </Link>

            <Link
              href="/ideas/new"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-900 bg-stone-900 px-7 py-3.5 font-bold text-white shadow-[4px_4px_0px_#e7e5e4] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-stone-800 active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Pin Your Thought</span>
              <span className="font-mono text-sm">＋</span>
            </Link>
          </div>
        </section>

        {/* Fun Sticky Note Showcase Preview */}
        <section className="relative my-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="relative flex min-h-[220px] flex-col rounded-2xl border border-stone-300/40 bg-amber-200 p-6 text-left shadow-[4px_8px_0px_rgba(41,37,36,0.08)] rotate-[-2deg] transition-transform hover:rotate-0 hover:scale-105">
            <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-stone-400 bg-white/80 shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/60 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-stone-700">
                project
              </span>
              <span className="font-mono text-xs text-stone-600">2h ago</span>
            </div>
            <h3 className="mt-4 font-black leading-snug text-stone-900">
              AI Git Commit Haikus
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-700">
              A CLI tool that turns messy commit logs into poetic 5-7-5 haikus
              before you push to main branch.
            </p>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs font-bold text-stone-800">
              <span>👍 24 · 💡 12</span>
              <span className="font-mono text-[11px] text-stone-600">
                4 comments
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative flex min-h-[220px] flex-col rounded-2xl border border-stone-300/40 bg-pink-200 p-6 text-left shadow-[4px_8px_0px_rgba(41,37,36,0.08)] rotate-[1.5deg] transition-transform hover:rotate-0 hover:scale-105">
            <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-stone-400 bg-white/80 shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/60 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-stone-700">
                thought
              </span>
              <span className="font-mono text-xs text-stone-600">yesterday</span>
            </div>
            <h3 className="mt-4 font-black leading-snug text-stone-900">
              Retro Game Sounds for Build Success
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-700">
              Why don&apos;t compilers play 8-bit fanfare when all tests pass
              and Zelda defeat sound when it breaks?
            </p>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs font-bold text-stone-800">
              <span>❤️ 48 · 🤔 19</span>
              <span className="font-mono text-[11px] text-stone-600">
                11 comments
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative flex min-h-[220px] flex-col rounded-2xl border border-stone-300/40 bg-sky-200 p-6 text-left shadow-[4px_8px_0px_rgba(41,37,36,0.08)] rotate-[-1deg] transition-transform hover:rotate-0 hover:scale-105">
            <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-stone-400 bg-white/80 shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/60 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-stone-700">
                feature
              </span>
              <span className="font-mono text-xs text-stone-600">3d ago</span>
            </div>
            <h3 className="mt-4 font-black leading-snug text-stone-900">
              PostgreSQL JSONB + Auth
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-700">
              Building lightweight session tokens stored with SHA-256 hashes
              gives you instant security with zero SaaS bloat.
            </p>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs font-bold text-stone-800">
              <span>💡 62 · 👍 31</span>
              <span className="font-mono text-[11px] text-stone-600">
                7 comments
              </span>
            </div>
          </div>
        </section>

        {/* Minimal 3-Point Tech Grid */}
        <section className="my-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="font-mono text-xs font-black tracking-wider text-orange-600 uppercase">
              01 / Instant Capture
            </div>
            <h4 className="mt-3 text-lg font-black text-stone-900">
              10-Second Brain Dump
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Write title, dump raw text, pick category: thought, feature,
              question, or project. Hit publish.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="font-mono text-xs font-black tracking-wider text-orange-600 uppercase">
              02 / Real Reactions
            </div>
            <h4 className="mt-3 text-lg font-black text-stone-900">
              Feelings Over Algorithms
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              No endless feeds or like farming. Express real reactions with
              Like, Love, Interesting, or Inspired.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="font-mono text-xs font-black tracking-wider text-orange-600 uppercase">
              03 / Rock-Solid Stack
            </div>
            <h4 className="mt-3 text-lg font-black text-stone-900">
              Next.js & Neon PostgreSQL
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Custom token-hash session auth, bcrypt password protection, and
              instant relational queries.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-stone-200 py-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2">
            <Logo size={24} showText={false} href="/" />
            <span className="font-mono text-xs font-bold text-stone-600">
              StickyBrain © 2026
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-stone-500 sm:mt-0">
            A little corner for big ideas. ✳
          </p>
        </footer>
      </div>
    </div>
  );
}
