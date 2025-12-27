import ContentAPI from "@tryghost/content-api";

const apiUrl = process.env.GHOST_API_URL;
const contentKey = process.env.GHOST_CONTENT_KEY;

export const ghostApi =
  apiUrl && contentKey
    ? new ContentAPI({
        url: apiUrl,
        key: contentKey,
        version: "v5.0",
      })
    : null;

export const fetchPosts = async (tag?: string) => {
  if (!ghostApi) return [];
  const posts = await ghostApi.posts.browse({
    include: ["tags", "authors"],
    limit: 9,
    order: "published_at DESC",
    filter: tag ? `tag:${tag}` : undefined,
  });
  return posts;
};

export const fetchPostBySlug = async (slug: string) => {
  if (!ghostApi) return null;
  try {
    const post = await ghostApi.posts.read(
      { slug },
      {
        include: ["tags", "authors"],
      }
    );
    return post;
  } catch (_e) {
    return null;
  }
};

export const fetchAllSlugs = async () => {
  if (!ghostApi) return [];
  const posts = await ghostApi.posts.browse({ fields: ["slug"], limit: "all" });
  return posts.map((p) => p.slug);
};

