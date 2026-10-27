import { NextRequest, NextResponse } from "next/server";
import { listBlogs, saveBlog } from "../../../../lib/storage";
import { BlogPost } from "../../../../lib/types";
import { triggerFrontendRevalidation } from "../../../../lib/webhook";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector");
  const status = searchParams.get("status");

  let blogs = listBlogs();
  if (sector) {
    blogs = blogs.filter((b) => b.sector === sector);
  }
  if (status) {
    blogs = blogs.filter((b) => b.status === status);
  }

  return NextResponse.json({
    data: blogs,
    meta: {
      total: blogs.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: BlogPost = await req.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    saveBlog(body, "API_Client");

    if (body.status === "published") {
      await triggerFrontendRevalidation({
        entityType: "blog",
        slug: body.slug,
        action: "publish",
      });
    }

    return NextResponse.json({
      success: true,
      data: body,
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
