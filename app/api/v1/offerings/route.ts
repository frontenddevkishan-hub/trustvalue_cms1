import { NextRequest, NextResponse } from "next/server";
import { listOfferings, saveOffering } from "../../../../lib/storage";
import { Offering } from "../../../../lib/types";
import { triggerFrontendRevalidation } from "../../../../lib/webhook";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector") || undefined;
  const offerings = listOfferings(sector);

  return NextResponse.json({
    data: offerings,
    meta: {
      total: offerings.length,
      sector: sector || "all",
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: Offering = await req.json();

    if (!body.name || !body.slug || !body.sector || !body.provider) {
      return NextResponse.json(
        { error: "Name, slug, sector, and provider are required fields." },
        { status: 400 }
      );
    }

    const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const normalized: Offering = {
      slug: cleanSlug,
      name: body.name.trim(),
      sector: body.sector.trim(),
      provider: body.provider.trim(),
      primaryCategory: body.primaryCategory?.trim() || "general",
      status: body.status || "published",
      lastVerified: body.lastVerified || new Date().toISOString().split("T")[0],
      summary: body.summary?.trim() || `Audited plan offering by ${body.provider}.`,
      attributes: body.attributes || {},
      variants: body.variants || [],
    };

    saveOffering(normalized, "Admin");

    await triggerFrontendRevalidation({
      entityType: "offering",
      slug: `${normalized.sector}/${cleanSlug}`,
      action: "create",
    });

    return NextResponse.json(
      {
        success: true,
        message: `Plan offering "${normalized.name}" created under ${normalized.sector}.`,
        data: normalized,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
