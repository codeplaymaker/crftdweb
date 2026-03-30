import { NextResponse } from 'next/server';
import { sendTrialTask } from '@/app/actions/sendTrialTask';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await sendTrialTask('Obi', 'obiezeelijah@gmail.com');
  return NextResponse.json(result);
}
