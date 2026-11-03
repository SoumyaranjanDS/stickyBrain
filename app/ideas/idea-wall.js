"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const noteStyles = [
  "bg-amber-200 rotate-[-2deg]",
  "bg-pink-200 rotate-[1.5deg]",
  "bg-sky-200 rotate-[-1deg]",
  "bg-lime-200 rotate-[2deg]",
  "bg-violet-200 rotate-[-1.5deg]",
  "bg-orange-200 rotate-[1deg]",
];

const categoryLabels = {
  thought: "Thought",
  feature: "Feature",
  question: "Question",
  project: "Project",
  other: "Other",
};

function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function IdeaModal({ idea, onClose }) {
  const router = useRouter();
  const [interactionData, setInteractionData] = useState(null);
  const [interactionLoading, setInteractionLoading] = useState(true);
  const [interactionError, setInteractionError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Close the modal when the user presses Escape.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Fetch interactions when the modal mounts
  useEffect(() => {
    let cancelled = false;

    async function loadInteractions() {
      try {
        const response = await axios.get(`/api/ideas/${idea.id}/interactions`);

        if (!cancelled) {
          setInteractionData(response.data);
          setInteractionLoading(false);
        }
      } catch {
        if (!cancelled) {
          setInteractionError("Couldn't load reactions and comments.");
          setInteractionLoading(false);
        }
      }
    }

    loadInteractions();

    return () => {
      cancelled = true;
    };
  }, [idea.id]);

  async function handleReaction(reactionType) {
    if (!interactionData || !interactionData.isLoggedIn) {
      router.push("/login?next=%2Fideas");
      return;
    }

    setInteractionError("");

    const nextReaction =
      interactionData.myReaction === reactionType ? null : reactionType;

    try {
      await axios.post(`/api/ideas/${idea.id}/reactions`, {
        reactionType: nextReaction,
      });

      const response = await axios.get(`/api/ideas/${idea.id}/interactions`);

      setInteractionData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login?next=%2Fideas");
        return;
      }

      setInteractionError(
        error.response?.data?.message || "Couldn't update your reaction.",
      );
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!interactionData || !interactionData.isLoggedIn) {
      router.push("/login?next=%2Fideas");
      return;
    }

    const content = commentText.trim();
    if (!content || content.length > 1000) return;

    setCommentSubmitting(true);
    setInteractionError("");

    try {
      const response = await axios.post(`/api/ideas/${idea.id}/comments`, {
        content,
      });

      setInteractionData((previous) => ({
        ...previous,
        comments: [...(previous?.comments || []), response.data.comment],
      }));

      setCommentText("");
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login?next=%2Fideas");
        return;
      }

      setInteractionError(
        error.response?.data?.message || "Couldn't add your comment.",
      );
    } finally {
      setCommentSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="idea-modal-title"
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-[#fffdf5] p-6 shadow-2xl sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close idea details"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-stone-200/80 text-lg font-bold text-stone-700 transition hover:bg-stone-300"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-10">
          <span className="inline-flex rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-800">
            {categoryLabels[idea.category] || idea.category}
          </span>

          <p className="mt-3 text-sm text-stone-500">
            Pinned on {formatDate(idea.created_at)}
          </p>

          <h2
            id="idea-modal-title"
            className="mt-2 text-2xl font-black leading-tight tracking-tight text-stone-900 sm:text-3xl"
          >
            {idea.title}
          </h2>
        </div>

        {/* Idea Content */}
        <div className="rounded-2xl border border-amber-200/70 bg-amber-100/40 p-5 sm:p-7">
          <p className="whitespace-pre-wrap break-words text-base leading-8 text-stone-800">
            {idea.content}
          </p>
        </div>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-200 text-lg font-black text-stone-800">
            {idea.author_name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-bold text-stone-900">{idea.author_name}</p>
            <p className="text-sm text-stone-500">Shared with the idea wall</p>
          </div>
        </div>

        {/* Reactions Section */}
        <div className="mt-8 border-t border-stone-200 pt-6">
          <h3 className="text-lg font-black text-stone-900">
            How does this idea feel? ✳
          </h3>

          {interactionLoading ? (
            <p className="mt-4 text-sm text-stone-500">
              Loading reactions and comments...
            </p>
          ) : interactionData ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { type: "like", emoji: "👍", label: "Like" },
                  { type: "love", emoji: "❤️", label: "Love" },
                  {
                    type: "interesting",
                    emoji: "🤔",
                    label: "Interesting",
                  },
                  { type: "inspired", emoji: "💡", label: "Inspired" },
                ].map((reaction) => {
                  const active = interactionData.myReaction === reaction.type;

                  return (
                    <button
                      key={reaction.type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleReaction(reaction.type)}
                      className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-orange-400 bg-orange-100 text-orange-900 shadow-sm"
                          : "border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      {reaction.emoji} {reaction.label}
                      <span className="ml-1.5 rounded-full bg-black/5 px-2 py-0.5 text-xs font-bold">
                        {interactionData.reactionCounts[reaction.type] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!interactionData.isLoggedIn && (
                <p className="mt-3 text-sm text-stone-500">
                  <Link
                    href="/login?next=%2Fideas"
                    className="font-semibold text-orange-700 underline"
                  >
                    Log in
                  </Link>{" "}
                  to react or join the conversation.
                </p>
              )}

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-lg font-black text-stone-900">
                  The conversation 💬
                  <span className="ml-2 text-sm font-medium text-stone-400">
                    {interactionData.comments.length}
                  </span>
                </h3>

                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder={
                      interactionData.isLoggedIn
                        ? "Add your thoughts to the conversation..."
                        : "Please log in to add a comment"
                    }
                    maxLength={1000}
                    rows={3}
                    required
                    disabled={commentSubmitting || !interactionData.isLoggedIn}
                    className="w-full resize-y rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-stone-400">
                      {commentText.length}/1000
                    </span>

                    <button
                      type="submit"
                      disabled={
                        commentSubmitting ||
                        !interactionData.isLoggedIn ||
                        !commentText.trim() ||
                        commentText.trim().length > 1000
                      }
                      className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {commentSubmitting ? "Posting..." : "Post comment"}
                    </button>
                  </div>
                </form>

                <div className="mt-6 space-y-4">
                  {interactionData.comments.length === 0 ? (
                    <p className="rounded-2xl bg-stone-100/70 p-5 text-center text-sm text-stone-500">
                      No comments yet. Be the first to share a thought!
                    </p>
                  ) : (
                    interactionData.comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="rounded-2xl bg-white p-4 ring-1 ring-stone-200/70"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-stone-900">
                            {comment.author_name}
                          </p>

                          <time className="shrink-0 text-xs text-stone-400">
                            {formatDate(comment.created_at)}
                          </time>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-700">
                          {comment.content}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : null}

          {interactionError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
              {interactionError}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-stone-400">
          Good ideas get better when shared on StickyBrain. ✳
        </p>
      </section>
    </div>
  );
}

export default function IdeaWall({ ideas }) {
  const [selectedIdea, setSelectedIdea] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 px-2 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedIdea(idea)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIdea(idea);
              }
            }}
            aria-label={`Read idea: ${idea.title}`}
            className={`group relative flex min-h-64 cursor-pointer flex-col p-6 text-left shadow-[3px_7px_0px_rgba(41,37,36,0.06)] transition duration-200 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:shadow-[5px_12px_20px_rgba(41,37,36,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${noteStyles[index % noteStyles.length]}`}
          >
            <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-stone-500/20 bg-white/70 shadow-sm" />

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-700">
                {categoryLabels[idea.category] || idea.category}
              </span>

              <time className="text-xs text-stone-600">
                {formatDate(idea.created_at)}
              </time>
            </div>

            <h3 className="mt-5 text-xl font-black leading-snug text-stone-900">
              {idea.title}
            </h3>

            <p className="mt-3 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-stone-700">
              {idea.content}
            </p>

            <div className="mt-auto flex items-center gap-3 border-t border-stone-900/10 pt-5 mt-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/60 text-sm font-black text-stone-800">
                {idea.author_name?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-stone-800">
                  {idea.author_name}
                </p>
                <p className="text-xs text-stone-600">Idea collector</p>
              </div>

              <span className="ml-auto text-xs font-bold text-stone-700/80 transition group-hover:translate-x-1">
                Read & discuss ↗
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedIdea && (
        <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </>
  );
}
