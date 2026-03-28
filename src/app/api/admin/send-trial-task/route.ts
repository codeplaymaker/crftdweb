import { NextRequest, NextResponse } from 'next/server';
import { sendTrialTask } from '@/app/actions/sendTrialTask';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
    }
    const result = await sendTrialTask(name, email);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
