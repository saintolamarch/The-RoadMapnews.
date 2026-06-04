/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, dbSubmitContact } from '../utils/supabase';

interface ContactFormProps {
  activeTheme?: 'editorial' | 'magazine' | 'cyber';
}

export default function ContactForm({ activeTheme = 'editorial' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('news_tip');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const isCyber = activeTheme === 'cyber';
  const isMagazine = activeTheme === 'magazine';

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate record saving or endpoint logging
    const contactRecord = {
      id: Date.now(),
      name,
      email,
      phone,
      category,
      message,
      date: new Date().toISOString()
    };

    const existingRecords = JSON.parse(localStorage.getItem('punch-contact-messages') || '[]');
    existingRecords.push(contactRecord);
    localStorage.setItem('punch-contact-messages', JSON.stringify(existingRecords));

    // Supabase Sync
    if (isSupabaseConfigured()) {
      dbSubmitContact(contactRecord);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 select-text ${
      isCyber 
        ? 'bg-[#18181b]/40 border-stone-850 text-stone-200 shadow-none' 
        : 'bg-white border-stone-200/85 text-stone-900 shadow-sm'
    }`}>
      <div className={`border-b pb-2 mb-4 ${isCyber ? 'border-stone-800' : 'border-stone-200'}`}>
        <h4 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${isCyber ? 'text-white' : 'text-stone-900'}`}>
          <MessageSquare className="w-4 h-4 text-[#ea1c24]" />
          📬 Contact & Editorial Desk
        </h4>
        <p className={`text-[10px] ${isCyber ? 'text-stone-400' : 'text-stone-500'} mt-0.5`}>Submit tips, advert inquiries, or complaints.</p>
      </div>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded font-sans text-xs flex items-start gap-1.5 animate-fade-in animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Message Dispatched!</strong>
            <p className="text-[10px] text-stone-600 mt-1">Our editorial board will contact you shortly.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-3 font-sans text-xs">
          
          <div className="space-y-1">
            <label className={`block text-[10px] font-mono font-bold uppercase ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Olusegun Abraham"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 border transition-colors ${
                isCyber 
                  ? 'bg-stone-950 border-stone-800 text-white placeholder:text-stone-650' 
                  : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-405'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className={`block text-[10px] font-mono font-bold uppercase ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. name@domain.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 border transition-colors ${
                  isCyber 
                    ? 'bg-stone-950 border-stone-800 text-white placeholder:text-stone-650' 
                    : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-405'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className={`block text-[10px] font-mono font-bold uppercase ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                placeholder="e.g. +234 803 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 border transition-colors ${
                  isCyber 
                    ? 'bg-stone-950 border-stone-800 text-white placeholder:text-stone-650' 
                    : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-405'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`block text-[10px] font-mono font-bold uppercase ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>
              Inquiry Department
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded p-2 text-xs border transition-colors focus:outline-none focus:ring-1 focus:ring-red-500 ${
                isCyber 
                  ? 'bg-stone-950 border-stone-800 text-stone-300' 
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <option value="news_tip">Anonymous News Tip / Leak</option>
              <option value="advers">Classified Advertisements & Sponsorships</option>
              <option value="corrections">Press Corrections & Clarifications</option>
              <option value="it_support">E-paper Technical Support</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={`block text-[10px] font-mono font-bold uppercase ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>
              Your Message Column
            </label>
            <textarea
              required
              rows={3}
              placeholder="State your details concisely for quick reference."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full rounded p-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 border transition-colors ${
                isCyber 
                  ? 'bg-stone-950 border-stone-800 text-white placeholder:text-stone-650' 
                  : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-405'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ea1c24] hover:bg-red-700 text-white font-mono text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Form Desk
          </button>

        </form>
      )}

    </div>
  );
}
