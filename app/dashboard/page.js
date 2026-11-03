import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./logout-button";
import Logo from "@/components/logo";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Logo size={36} href="/ideas" />
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                StickyBrain Member
              </span>
              <h1 className="mt-1 text-3xl font-black text-stone-900">
                Welcome, {user.name}!
              </h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-black text-stone-800">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <p className="mt-2 text-stone-600">
            You are signed in to your StickyBrain account.
          </p>

          <div className="mt-6 space-y-2.5 rounded-xl bg-stone-50 p-4 border border-stone-200/60 text-sm text-stone-700">
            <p>
              <strong className="text-stone-900">User ID:</strong>{" "}
              <span className="font-mono text-xs">{user.id}</span>
            </p>
            <p>
              <strong className="text-stone-900">Email:</strong> {user.email}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-stone-100 pt-6">
            <Link
              href="/ideas"
              className="inline-flex rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 shadow-sm"
            >
              Explore Idea Wall 💡
            </Link>

            <Link
              href="/ideas/new"
              className="inline-flex rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 shadow-sm"
            >
              Pin an Idea ＋
            </Link>

            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
