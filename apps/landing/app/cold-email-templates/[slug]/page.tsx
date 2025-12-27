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
      <div className="relative mx-auto max-w-3xl px-5 py-10 lg:py-14 space-y-8">
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

        <header className="space-y-3 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent p-6 shadow-xl shadow-sky-500/20">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
              {post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : ""}
            </p>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              Cold email template
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
          <p className="text-lg text-white/80">{post.excerpt || post.meta_description || ""}</p>
          <p className="text-white/60 text-sm">
            Copy, adapt, and ship fast—keep the bones, swap the proof, and keep one CTA.
          </p>
        </header>

        <div className="prose prose-invert prose-headings:text-white prose-p:text-white/80 prose-a:text-sky-200 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.html || "" }} />
        </div>
      </div>
    </div>
  );
}

