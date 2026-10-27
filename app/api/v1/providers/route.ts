import { NextRequest, NextResponse } from "next/server";
import { listProviders, saveProvider } from "../../../../lib/storage";
import { Provider } from "../../../../lib/types";
import { triggerFrontendRevalidation } from "../../../../lib/webhook";

export async function GET() {
  const providers = listProviders();
  return NextResponse.json({
    data: providers,
    meta: {
      total: providers.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: Provider = await req.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Provider name and slug are required" }, { status: 400 });
    }

    const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const normalized: Provider = {
      slug: cleanSlug,
      name: body.name.trim(),
      type: body.type?.trim() || "Brand",
      parentGroup: body.parentGroup?.trim() || undefined,
      website: body.website?.trim() || undefined,
      sectors: body.sectors && Object.keys(body.sectors).length > 0 ? body.sectors : {
        banking: {
          description: `Audited institutional profile for ${body.name}`,
        }
      },
    };

    saveProvider(normalized, "Admin");

    await triggerFrontendRevalidation({
      entityType: "provider",
      slug: cleanSlug,
      action: "create",
    });

    return NextResponse.json(
      {
        success: true,
        message: `Provider brand "${normalized.name}" (${normalized.slug}) created successfully.`,
        data: normalized,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
