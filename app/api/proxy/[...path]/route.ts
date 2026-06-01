import { NextRequest } from 'next/server';
import { getCookies } from '@/helper/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelink-ukl2026.up.railway.app';

const joinUrl = (base: string, path: string) => {
  const trimmed = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${trimmed}/${cleanPath}`;
};

const proxyRequest = async (request: NextRequest, pathParts: string[]) => {
  const targetPath = pathParts.join('/');
  const targetUrl = joinUrl(API_BASE_URL, targetPath) + request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');

  const token = await getCookies('token');
  if (token && !headers.has('authorization')) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path);
}
