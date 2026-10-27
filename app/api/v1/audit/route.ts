import { NextResponse } from "next/server";
import { listAuditLogs } from "../../../../lib/storage";

export async function GET() {
  const logs = listAuditLogs();
  return NextResponse.json({
    data: logs,
    meta: {
      total: logs.length,
      timestamp: new Date().toISOString(),
    },
  });
}
