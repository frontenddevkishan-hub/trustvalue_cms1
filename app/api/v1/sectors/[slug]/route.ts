import { NextRequest, NextResponse } from "next/server";
import { getSectorBySlug, saveSector } from "../../../../../lib/storage";
import { triggerFrontendRevalidation } from "../../../../../lib/webhook";

type Context = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) {
    return NextResponse.json({ error: `Sector ${slug} not found` }, { status: 404 });
  }
  return NextResponse.json({ data: sector });
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const updated = { ...body, slug };
    saveSector(updated, "API_Client");

    // trigger frontend on-demand revalidation
    await triggerFrontendRevalidation({
      entityType: "sector",
      slug,
      action: "update",
    });

    return NextResponse.json({
      success: true,
      message: `Sector ${slug} updated and revalidation dispatched.`,
      data: updated,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
