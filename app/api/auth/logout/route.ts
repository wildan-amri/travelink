import { NextResponse } from 'next/server';
import { deleteCookies } from '@/helper/cookies';

export async function POST() {
  await deleteCookies('token');
  return NextResponse.json({ ok: true });
}
