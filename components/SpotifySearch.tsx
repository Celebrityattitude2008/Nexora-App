'use client';

import { useState } from 'react';
import axios from 'axios';

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  preview_url: string | null;
  external_urls: { spotify: string };
};

type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
};

export function SpotifySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'track' | 'artist'>('track');
  const [results, setResults] = useState<(SpotifyTrack | SpotifyArtist)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Using Spotify API - you'll need to add your Client ID and Secret to .env.local
      // Get credentials from https://developer.spotify.com
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
      const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || '';

      if (!clientId || !clientSecret) {
        setError('Spotify credentials not configured. Add to .env.local');
        setResults([]);
        return;
      }

      // Get access token
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Search
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: searchQuery,
          type: searchType,
          limit: 5,
        },
      });

      const data = searchType === 'track' ? response.data.tracks.items : response.data.artists.items;
      setResults(data);
    } catch (err) {
      setError('Search failed. Configure Spotify API credentials.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 sm:p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Music Discovery</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-white">Spotify Search</h2>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${searchType}s...`}
            className="flex-1 rounded-lg bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-amber-400/20 border border-amber-400/40 px-4 sm:px-6 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-400/30 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-2">
          {(['track', 'artist'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSearchType(type)}
              className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition ${
                searchType === type
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </form>

      {/* Error Message */}
      {error && <div className="text-sm text-amber-300 mb-4 py-2">{error}</div>}

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition cursor-pointer"
              onClick={() => {
                if ('preview_url' in result) setCurrentTrack(result);
              }}
            >
              <div className="flex gap-4">
                <img
                  src={('album' in result ? result.album.images[0]?.url : result.images[0]?.url) || ''}
                  alt={result.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-100 text-sm sm:text-base truncate">{result.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {'artists' in result ? result.artists.map((a) => a.name).join(', ') : 'Artist'}
                  </p>
                  {('album' in result && result.album) && (
                    <p className="text-xs text-slate-500 mt-1">{result.album.name}</p>
                  )}
                  <a
                    href={result.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-300 hover:text-amber-200 mt-2 inline-block"
                  >
                    Open in Spotify →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Playing Track */}
      {currentTrack && currentTrack.preview_url && (
        <div className="mt-6 rounded-2xl border border-amber-400/30 bg-slate-950/70 p-4">
          <h3 className="font-semibold text-slate-100 text-sm sm:text-base mb-3">Now Playing</h3>
          <div className="flex gap-3 items-center">
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              className="w-12 h-12 rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-100 text-sm truncate">{currentTrack.name}</p>
              <p className="text-xs text-slate-400">{currentTrack.artists.map((a) => a.name).join(', ')}</p>
            </div>
          </div>
          <audio src={currentTrack.preview_url} controls className="w-full mt-3 h-8" />
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="text-center py-8 text-slate-400 text-sm">
          Search for tracks or artists to get started
        </div>
      )}
    </section>
  );
}
