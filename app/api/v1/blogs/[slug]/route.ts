import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug, saveBlog, deleteBlog } from "../../../../../lib/storage";
import { triggerFrontendRevalidation } from "../../../../../lib/webhook";

type Context = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) {
    return NextResponse.json({ error: `Blog ${slug} not found` }, { status: 404 });
  }
  return NextResponse.json({ data: blog });
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const updated = { ...body, slug };
    saveBlog(updated, "API_Client");

    if (updated.status === "published") {
      await triggerFrontendRevalidation({
        entityType: "blog",
        slug,
        action: "update",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Blog ${slug} updated and synchronized.`,
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  const deleted = deleteBlog(slug, "API_Client");
  if (!deleted) {
    return NextResponse.json({ error: `Blog ${slug} not found` }, { status: 404 });
  }

  await triggerFrontendRevalidation({
    entityType: "blog",
    slug,
    action: "delete",
  });

  return NextResponse.json({
    success: true,
    message: `Blog ${slug} deleted.`,
  });
}
