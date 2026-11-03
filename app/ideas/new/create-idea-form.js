"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateIdeaForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "thought",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/ideas", formData);

      router.push("/ideas");
      router.refresh();
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login?next=%2Fideas%2Fnew");
        return;
      }

      const data = err.response?.data;

      setError(
        data?.errors
          ? Object.values(data.errors).flat().join(" ")
          : data?.message || "Unable to create your idea.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Idea title
        </label>

        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. An AI-powered study planner"
          minLength={3}
          maxLength={160}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Tell us about your idea
        </label>

        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="What is the idea? What problem does it solve?"
          minLength={10}
          maxLength={5000}
          rows={6}
          required
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <p className="mt-1 text-xs text-gray-500">
          {formData.content.length}/5000 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
        >
          <option value="thought">Thought</option>
          <option value="feature">Feature</option>
          <option value="question">Question</option>
          <option value="project">Project</option>
          <option value="other">Other</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Publishing..." : "Publish idea"}
      </button>
    </form>
  );
}
