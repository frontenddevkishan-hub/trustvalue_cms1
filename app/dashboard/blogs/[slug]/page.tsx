import { getBlogBySlug } from "../../../../lib/storage";
import { BlogEditorClient } from "./BlogEditorClient";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogEditorPage({ params }: Props) {
  const { slug } = await params;
  const initialPost = slug === "new" ? null : getBlogBySlug(slug);

  return <BlogEditorClient initialPost={initialPost} slug={slug} />;
}
