import { NextResponse } from "next/server";
import { insertSubmission } from "@/lib/bigquery";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formId, formName, data, metadata } = body;

    await insertSubmission({
      id: crypto.randomUUID(),
      formId: formId || "unknown",
      formName: formName || "Untitled Form",
      data: data || {},
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
