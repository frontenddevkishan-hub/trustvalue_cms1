import { listBlogs } from "../../../lib/storage";
import { BlogsClient } from "./BlogsClient";

export default function BlogsPage() {
  const blogs = listBlogs();
  return <BlogsClient initialBlogs={blogs} />;
}
