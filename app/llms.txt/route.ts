import { getAllPosts } from "@/lib/blog";
import { buildLlmsTxt } from "@/lib/llms-txt";

export function GET() {
  const body = buildLlmsTxt(getAllPosts());
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
