import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'track';
  const limit = searchParams.get('limit') || '5';

  if (!query.trim()) {
    return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Spotify credentials are not configured on the server.' }, { status: 500 });
  }

  const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    return NextResponse.json({ error: errorBody || 'Spotify authentication failed.' }, { status: tokenResponse.status });
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  const searchUrl = new URL('https://api.spotify.com/v1/search');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('type', type);
  searchUrl.searchParams.set('limit', limit);

  const response = await fetch(searchUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'Spotify search failed.' }, { status: response.status });
  }

  return NextResponse.json(data);
}
