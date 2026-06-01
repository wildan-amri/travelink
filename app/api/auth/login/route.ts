import { NextResponse } from 'next/server';
import { storeCookies } from '@/helper/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelink-ukl2026.up.railway.app';

const unwrapResponse = (body: any) => {
  if (body && typeof body === 'object' && 'statusCode' in body && 'data' in body && 'timestamp' in body) {
    return body.data;
  }
  return body;
};

export async function POST(request: Request) {
  const payload = await request.json();
  const upstream = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await upstream.json();
  const unwrapped = unwrapResponse(data);
  const token = unwrapped?.accessToken ?? unwrapped?.access_token ?? unwrapped?.token;

  if (token) {
    await storeCookies('token', token);
  }

  return NextResponse.json(unwrapped, { status: upstream.status });
}
