import { NextRequest, NextResponse } from "next/server";
import { listSectors, saveSector } from "../../../../lib/storage";
import { SectorConfig } from "../../../../lib/types";
import { triggerFrontendRevalidation } from "../../../../lib/webhook";

export async function GET() {
  const sectors = listSectors();
  return NextResponse.json({
    data: sectors,
    meta: {
      total: sectors.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: SectorConfig = await req.json();
    if (!body.slug || !body.name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    const normalized: SectorConfig = {
      nav: { providers: "Providers", categories: "Categories" },
      labels: {
        provider: "Provider",
        providers: "Providers",
        offering: "Plan",
        offerings: "Plans",
        variant: "Variant",
        levels: ["Segment", "Category"],
      },
      maxCategoryDepth: 2,
      attributes: [],
      categories: [{ slug: "general", name: "General Services" }],
      ...body,
      status: "published",
    };

    saveSector(normalized, "Admin");

    await triggerFrontendRevalidation({
      entityType: "sector",
      slug: normalized.slug,
      action: "create",
    });

    return NextResponse.json(
      {
        success: true,
        message: `Sector ${normalized.name} (${normalized.slug}) created successfully.`,
        data: normalized,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
