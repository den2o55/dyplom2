import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formId, formName, data, metadata } = body;

    store.addSubmission({
      id: crypto.randomUUID(),
      formId: formId || 'unknown',
      formName: formName || 'Untitled Form',
      data: data || {},
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
