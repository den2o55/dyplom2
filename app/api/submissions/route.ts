import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/bigquery";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const submissions = await getSubmissions(100);
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
