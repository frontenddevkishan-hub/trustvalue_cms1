import { NextRequest, NextResponse } from "next/server";
import { addCategoryToSector, listSectorCategories } from "../../../../lib/storage";
import { triggerFrontendRevalidation } from "../../../../lib/webhook";

export async function GET() {
  const categories = listSectorCategories();
  return NextResponse.json({
    data: categories,
    meta: {
      total: categories.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectorSlug, name, slug, parentCategorySlug, intro } = body;

    if (!sectorSlug || !name || !slug) {
      return NextResponse.json(
        { error: "sectorSlug, name, and slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const success = addCategoryToSector(
      sectorSlug,
      {
        slug: cleanSlug,
        name,
        parentCategorySlug: parentCategorySlug || undefined,
        intro: intro || undefined,
      },
      "Admin"
    );

    if (!success) {
      return NextResponse.json(
        { error: `Sector "${sectorSlug}" was not found.` },
        { status: 404 }
      );
    }

    await triggerFrontendRevalidation({
      entityType: "category",
      slug: `${sectorSlug}/${cleanSlug}`,
      action: "create",
    });

    return NextResponse.json(
      {
        success: true,
        message: `Category "${name}" created under sector "${sectorSlug}".`,
        data: { sectorSlug, slug: cleanSlug, name, parentCategorySlug, intro },
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
