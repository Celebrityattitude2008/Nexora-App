import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'News API key is not configured on the server.' }, { status: 500 });
  }

  const url = new URL('https://newsapi.org/v2/top-headlines');
  url.searchParams.set('category', category);
  url.searchParams.set('country', 'us');
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.message || 'Failed to fetch news from NewsAPI.' }, { status: response.status });
  }

  return NextResponse.json(data);
}
