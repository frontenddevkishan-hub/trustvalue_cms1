import { NextRequest, NextResponse } from "next/server";
import { triggerFrontendRevalidation, RevalidationPayload } from "../../../../lib/webhook";

export async function POST(req: NextRequest) {
  try {
    const payload: RevalidationPayload = await req.json();
    const result = await triggerFrontendRevalidation(payload);

    return NextResponse.json({
      success: result.success,
      status: result.status,
      message: result.message,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
