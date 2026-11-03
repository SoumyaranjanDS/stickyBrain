import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import CreateIdeaForm from "./create-idea-form";
import Logo from "@/components/logo";

export default async function NewIdeaPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=%2Fideas%2Fnew");
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo size={32} href="/ideas" />
          <Link
            href="/ideas"
            className="text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Back to idea wall
          </Link>
        </div>

        <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
          Pin an idea to Sticky<span className="text-orange-500">Brain</span>
        </h1>

        <p className="mt-2 text-stone-600">
          Put your thoughts on the board for others to discover, react to, and discuss.
        </p>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <CreateIdeaForm />
        </div>
      </div>
    </main>
  );
}
