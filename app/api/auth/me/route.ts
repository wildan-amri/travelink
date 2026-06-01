import { NextResponse } from 'next/server';
import { deleteCookies, getCookies } from '@/helper/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelink-ukl2026.up.railway.app';

const unwrapResponse = (body: any) => {
  if (body && typeof body === 'object' && 'statusCode' in body && 'data' in body && 'timestamp' in body) {
    return body.data;
  }
  return body;
};

export async function GET() {
  const token = await getCookies('token');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await upstream.json();
  const unwrapped = unwrapResponse(data);

  if (upstream.status === 401) {
    await deleteCookies('token');
  }

  return NextResponse.json(unwrapped, { status: upstream.status });
}
