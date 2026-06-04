/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Edit3, Send, Landmark, Trash2 } from 'lucide-react';
import { LetterToEditor } from '../types';
import { isSupabaseConfigured, dbFetchLetters, dbUpsertLetter, dbDeleteLetter } from '../utils/supabase';

export default function LettersSection() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Prepopulated Editorial Letters
  const [letters, setLetters] = useState<LetterToEditor[]>(() => {
    const saved = localStorage.getItem('editorial-letters');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'letter-1',
        name: 'Chief Olatunde Animashaun',
        location: 'Ikorodu, Lagos',
        title: 'Re-evaluating the Rising Cost of Feed Commodities',
        message: 'Sir, the constant price spikes in primary animal feed concentrates have brought local poultry farmers to their knees. If the Ministry of Agriculture does not launch localized maize grants immediately, your breakfast table will soon have no eggs.',
        date: 'May 27, 2026'
      },
      {
        id: 'letter-2',
        name: 'Nneka Okonjo',
        location: 'Enugu',
        title: 'Commending the Yaba Tech Renaissance',
        message: 'Editor, the infrastructure grant targeted at Yaba is a magnificent step. However, let us not forget the young developers and hardware hubs in Enugu and Port Harcourt. We need a coordinated national policy that supports localized software nurseries beyond Lagos State.',
        date: 'May 26, 2026'
      }
    ];
  });

  // Fetch letters from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const loadLetters = async () => {
        try {
          const liveLetters = await dbFetchLetters(letters);
          setLetters(liveLetters);
          localStorage.setItem('editorial-letters', JSON.stringify(liveLetters));
        } catch (e) {
          console.error('Failed to load letters from Supabase database:', e);
        }
      };
      loadLetters();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !message.trim()) return;

    const newLetter: LetterToEditor = {
      id: `custom-letter-${Date.now()}`,
      name: name.trim(),
      location: location.trim(),
      title: title.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [newLetter, ...letters];
    setLetters(updated);
    localStorage.setItem('editorial-letters', JSON.stringify(updated));

    // Supabase Sync
    if (isSupabaseConfigured()) {
      dbUpsertLetter(newLetter);
    }

    setName('');
    setTitle('');
    setMessage('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const filtered = letters.filter((l) => l.id !== id);
    setLetters(filtered);
    localStorage.setItem('editorial-letters', JSON.stringify(filtered));

    // Supabase Sync
    if (isSupabaseConfigured()) {
      dbDeleteLetter(id);
    }
  };

  return (
    <div className="border border-stone-800 p-4 bg-[#faf7ee] shadow-sm select-text">
      
      {/* Section Header */}
      <div className="border-b-2 border-stone-900 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 ">
          <Edit3 className="w-4 h-4 text-red-700 shrink-0" />
          <h3 className="font-serif font-black text-sm uppercase tracking-tight text-stone-950">
            Letters to the Editor
          </h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-mono font-bold bg-neutral-900 hover:bg-neutral-800 text-stone-100 py-1 px-2.5 rounded transition cursor-pointer"
        >
          {showForm ? "Cancel Writer" : "Write Letter"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-stone-100 p-4 border border-stone-300 rounded space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kolawole Davies"
                className="w-full bg-white border border-stone-300 p-1 rounded"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">State of Residence</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lagos"
                className="w-full bg-white border border-stone-300 p-1 rounded"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">Subject Heading</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Re: High Power Grid Tariffs"
              className="w-full bg-white border border-stone-300 p-1 rounded"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">Editorial Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sir, writing to voice concern over..."
              className="w-full bg-white border border-stone-300 p-1 p-1.5 rounded"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-mono font-bold py-1.5 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            Dispatch to Editorial Desk
          </button>
        </form>
      )}

      {/* Letters List Column-Layout */}
      <div className="space-y-5">
        {letters.map((letter) => (
          <div key={letter.id} className="border-b border-dashed border-stone-300 pb-4 last:border-0 last:pb-0 relative group">
            
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-serif font-black text-xs sm:text-sm text-stone-900 leading-tight">
                &ldquo;{letter.title}&rdquo;
              </h4>
              {letter.id.startsWith('custom-') && (
                <button
                  onClick={() => handleDelete(letter.id)}
                  className="p-1 text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Erase Letter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="font-serif text-[11.5px] leading-relaxed text-stone-750 text-justify mt-1 italic">
              {letter.message}
            </p>

            <div className="flex justify-between items-center text-[9px] font-mono text-stone-500 mt-2">
              <span className="font-semibold text-stone-900 font-sans italic">
                — {letter.name}, {letter.location}
              </span>
              <span>{letter.date}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
