import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostBySlug } from "@/lib/ghost";

export const dynamic = "force-dynamic";

export default async function ColdEmailTemplate({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const isTemplate = (post?.tags || []).some((t: any) => t.name?.toLowerCase() === "cold email template");
  if (!post || !isTemplate) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-[#0b1221] text-white">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 py-10 lg:py-14 space-y-8">
        <div className="flex items-center justify-between text-sm text-white/70">
          <Link href="/cold-email-templates" className="hover:text-white">
            ← Back to templates
          </Link>
          <div className="flex gap-2">
            {(post.tags || []).map((tag: any) => (
              <span key={tag.id} className="rounded-full border border-white/15 px-2 py-1 text-xs">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
          <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
              {post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : ""}
            </p>
            <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
            <p className="text-white/80 text-lg">{post.excerpt || post.meta_description || ""}</p>

            <article className="prose prose-invert prose-headings:text-white prose-p:text-white/80 prose-a:text-sky-200 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.html || "" }} />
            </article>
          </div>

          <aside className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">How to use</p>
            <ul className="space-y-2">
              <li>Use placeholders like {"{{first_name}}"}, {"{{company}}"}, {"{{problem}}"}, {"{{team}}"}.</li>
              <li>Keep one CTA. Under 5 lines performs best.</li>
              <li>Subject lines can be A/B tested; include 2–3 variations in the post.</li>
              <li>Tag your Ghost post with “cold email template” to appear here.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

