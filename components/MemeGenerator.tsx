'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type MemeTemplate = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
};

type GeneratedMeme = {
  success: boolean;
  data: {
    url: string;
    page_url: string;
  };
};

export function MemeGenerator() {
  const [memes, setMemes] = useState<MemeTemplate[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [texts, setTexts] = useState<string[]>([]);
  const [generatedMeme, setGeneratedMeme] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showProfileUpload, setShowProfileUpload] = useState(false);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      // Using imgflip API for memes
      const response = await axios.get('https://api.imgflip.com/get_memes');
      const templates = response.data.data.memes.slice(0, 10);
      setMemes(templates);
    } catch (err) {
      setError('Failed to fetch meme templates');
    }
    setLoading(false);
  };

  const handleSelectMeme = (meme: MemeTemplate) => {
    setSelectedMeme(meme);
    setTexts(Array(meme.box_count).fill(''));
    setGeneratedMeme('');
  };

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const generateMeme = async () => {
    if (!selectedMeme) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        template_id: selectedMeme.id,
        username: 'nexora_user',
        password: 'imgflip',
      });

      texts.forEach((text, idx) => {
        params.append(`boxes[${idx}][text]`, text);
      });

      const response = await axios.post('https://api.imgflip.com/caption_image', params);
      const data = response.data as GeneratedMeme;

      if (data.success) {
        setGeneratedMeme(data.data.url);
      } else {
        setError('Failed to generate meme');
      }
    } catch (err) {
      setError('Error generating meme');
    }
    setLoading(false);
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadMeme = () => {
    if (!generatedMeme) return;
    const link = document.createElement('a');
    link.href = generatedMeme;
    link.download = `meme-${Date.now()}.png`;
    link.click();
  };

  return (
    <section className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 sm:p-6 shadow-panel backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Creative Tools</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-white">Meme Generator</h2>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-6">
        <button
          onClick={() => setShowProfileUpload(!showProfileUpload)}
          className="text-sm text-amber-300 hover:text-amber-200 transition mb-2"
        >
          {showProfileUpload ? '▼' : '▶'} {'Add Your Profile Picture (Base64)'}
        </button>
        {showProfileUpload && (
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4 mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className="text-xs text-slate-300 w-full"
            />
            {profilePic && (
              <div className="mt-3 flex flex-col items-center gap-2">
                <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="text-xs text-slate-400 break-all line-clamp-2">{profilePic.substring(0, 50)}...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meme Templates */}
      {!selectedMeme ? (
        <>
          {error && <div className="text-sm text-amber-300 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading templates...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {memes.map((meme) => (
                <button
                  key={meme.id}
                  onClick={() => handleSelectMeme(meme)}
                  className="rounded-lg overflow-hidden border border-slate-700/60 hover:border-amber-400/40 transition group"
                >
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-full h-24 sm:h-32 object-cover group-hover:opacity-80 transition"
                  />
                  <p className="text-xs text-slate-300 p-2 bg-slate-950/70 truncate">{meme.name}</p>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Meme Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">{selectedMeme.name}</h3>
              <button
                onClick={() => {
                  setSelectedMeme(null);
                  setGeneratedMeme('');
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-300 hover:bg-slate-800 transition"
              >
                Back
              </button>
            </div>

            {/* Text Inputs */}
            <div className="space-y-3 mb-4">
              {texts.map((text, idx) => (
                <div key={idx}>
                  <label className="text-xs text-slate-400 block mb-1">Text {idx + 1}</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleTextChange(idx, e.target.value)}
                    placeholder={`Enter text for box ${idx + 1}...`}
                    className="w-full rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/40"
                  />
                </div>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateMeme}
              disabled={loading}
              className="w-full rounded-lg bg-amber-400/20 border border-amber-400/40 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-400/30 transition disabled:opacity-50 mb-4"
            >
              {loading ? 'Generating...' : 'Generate Meme'}
            </button>

            {/* Generated Meme */}
            {generatedMeme && (
              <div className="rounded-lg border border-amber-400/30 bg-slate-950/70 p-4">
                <img src={generatedMeme} alt="Generated meme" className="w-full rounded-lg mb-3 max-h-96" />
                <button
                  onClick={downloadMeme}
                  className="w-full rounded-lg bg-green-400/20 border border-green-400/40 px-4 py-2 text-sm font-medium text-green-200 hover:bg-green-400/30 transition"
                >
                  Download Meme
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
