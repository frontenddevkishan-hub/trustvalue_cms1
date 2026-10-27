export interface RevalidationPayload {
  entityType: "sector" | "blog" | "category" | "provider" | "offering";
  slug: string;
  action: "create" | "update" | "delete" | "publish";
  secretToken?: string;
}

export async function triggerFrontendRevalidation(
  payload: RevalidationPayload,
  frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
): Promise<{ success: boolean; status: number; message: string }> {
  const secret = process.env.REVALIDATION_SECRET || "tv_reval_secret_dev";
  const endpoint = `${frontendUrl}/api/revalidate`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`,
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      return {
        success: true,
        status: res.status,
        message: `Frontend cache invalidated successfully for ${payload.entityType}/${payload.slug}`,
      };
    }

    return {
      success: false,
      status: res.status,
      message: `Frontend returned status ${res.status}. Stale cache may linger until next ISR window.`,
    };
  } catch (error: any) {
    // If running in development and frontend is not yet online
    return {
      success: false,
      status: 0,
      message: `Frontend unreachable (${error.message}). Mutation saved locally.`,
    };
  }
}
