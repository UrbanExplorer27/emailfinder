"use client";

import Link from "next/link";
import { fetchPosts } from "@/lib/ghost";

export default async function ColdEmailTemplates() {
  const posts = await fetchPosts();
  const templates = posts.filter((post: any) =>
    (post.tags || []).some((t: any) => t.name?.toLowerCase() === "cold email template")
  );

  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 py-10 lg:py-14 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Cold email templates</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Proven templates you can use now</h1>
          <p className="text-white/75 max-w-2xl">
            Each template is saved as a Ghost post tagged “cold email template.” Click through to see the structure,
            subject lines, and variations.
          </p>
        </header>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No templates yet. Add a Ghost post with the tag “cold email template” and it will appear here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((post: any) => (
              <Link
                key={post.slug}
                href={`/cold-email-templates/${post.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/15 hover:border-white/25 transition"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
                  {post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : ""}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
                <p className="mt-2 text-white/70 text-sm">{post.excerpt || post.meta_description || ""}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/65">
                  {(post.tags || []).map((tag: any) => (
                    <span key={tag.id} className="rounded-full border border-white/15 px-2 py-1">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-sky-200">View template →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

