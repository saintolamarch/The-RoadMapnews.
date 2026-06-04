/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Clock, MapPin, Printer, Bookmark, BookmarkCheck, Feather, AlertTriangle, BookOpen } from 'lucide-react';
import { Article } from '../types';

interface ReadingModalProps {
  article: Article | null;
  onClose: () => void;
  fontSizeClass: string;
  onBookmarkToggle: (id: string) => void;
  isBookmarked: boolean;
}

export default function ReadingModal({
  article,
  onClose,
  fontSizeClass,
  onBookmarkToggle,
  isBookmarked
}: ReadingModalProps) {
  if (!article) return null;

  const [annotation, setAnnotation] = useState('');
  const [annotations, setAnnotations] = useState<string[]>(() => {
    const saved = localStorage.getItem(`annotation-${article.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annotation.trim()) return;
    const updated = [...annotations, annotation.trim()];
    setAnnotations(updated);
    localStorage.setItem(`annotation-${article.id}`, JSON.stringify(updated));
    setAnnotation('');
  };

  const handleClearAnnotations = () => {
    setAnnotations([]);
    localStorage.removeItem(`annotation-${article.id}`);
  };

  // Convert text size choice to CSS font class for article body
  const getBodyFontClass = () => {
    switch (fontSizeClass) {
      case 'sm': return 'text-xs md:text-sm leading-relaxed';
      case 'lg': return 'text-base md:text-lg leading-relaxed';
      case 'xl': return 'text-lg md:text-xl leading-relaxed';
      case 'base':
      default:
        return 'text-sm md:text-base leading-relaxed';
    }
  };

  const printArticle = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm select-text">
      {/* Newspaper Broad Sheet Paper Frame */}
      <div 
        className="relative bg-[#faf7ee] text-stone-950 w-full max-w-5xl rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-4 border-stone-850 flex flex-col max-h-[92vh] overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(139, 94, 60, 0.04) 1px, transparent 0)', backgroundSize: '16px 16px' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-900 text-stone-100 border-b-2 border-slate-950 select-none">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-stone-300">
              BRADA GALAXY EDITION — BROAD SHEET READER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBookmarkToggle(article.id)}
              className="hover:text-red-400 p-1 rounded font-mono text-xs flex items-center gap-1 cursor-pointer transition"
              title={isBookmarked ? 'Stored in archives' : 'Add to personal index'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-green-500 fill-green-500/20" />
                  <span className="hidden sm:inline font-bold text-green-400">Indexed</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Index Article</span>
                </>
              )}
            </button>

            <button
              onClick={printArticle}
              className="hover:text-amber-400 p-1 rounded font-mono text-xs flex items-center gap-1 cursor-pointer transition"
              title="Print Broad-Sheet Column"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Print Layout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Outer content container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Category Tag & Meta tags */}
            <div className="flex flex-wrap items-center gap-2 select-none border-b border-stone-300 pb-2 text-xs font-mono">
              <span className="bg-red-700 text-white font-bold uppercase px-2.5 py-0.5 rounded-sm tracking-widest">
                {article.category}
              </span>
              <span className="text-stone-400">|</span>
              <span className="flex items-center gap-1 text-stone-700 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                {article.location}, NIGERIA
              </span>
              <span className="text-stone-400">|</span>
              <span className="flex items-center gap-1 text-stone-700 font-bold">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600 font-medium">{article.date}</span>
            </div>

            {/* Headline Group */}
            <div className="space-y-3">
              <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-stone-900 border-b border-stone-900/10 pb-4 leading-tight antialiased tracking-tight">
                {article.headline}
              </h1>
              {article.subheading && (
                <p className="font-serif italic font-medium text-base sm:text-lg text-stone-700 leading-relaxed border-b border-dashed border-stone-300 pb-4">
                  {article.subheading}
                </p>
              )}
            </div>

            {/* Byline & Author Seal */}
            <div className="flex items-center justify-between bg-stone-100 p-3 rounded border border-stone-200 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-serif font-black text-sm uppercase">
                  {article.byline.substring(0, 1)}
                </div>
                <div>
                  <div className="font-mono text-xs text-stone-500 uppercase tracking-widest font-bold">BYLINE DISPATCH</div>
                  <div className="font-serif font-black text-sm text-stone-900">{article.byline}</div>
                </div>
              </div>
              <div className="hidden sm:block text-right text-[10px] font-mono uppercase bg-red-100 text-red-800 px-2 py-1 rounded font-bold border border-red-200">
                ⭐ Press Guild Verified
              </div>
            </div>

            {/* Main Newspaper Grid Structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left-hand column: Image and Main Body Copy (9 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                
                {article.videoUrl && (
                  <div className="space-y-2 select-none">
                    <div className="relative group overflow-hidden border border-stone-400 p-1.5 bg-black shadow-sm">
                      <video 
                        src={article.videoUrl} 
                        controls 
                        autoPlay={false}
                        className="w-full h-auto max-h-[350px] object-cover rounded-xs" 
                        poster={article.image}
                      />
                      {/* Video tag overlay */}
                      <span className="absolute top-3 left-3 bg-[#ea1c24] text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shadow">
                        🔴 VIDEO TRANSMISSION
                      </span>
                    </div>
                    <p className="font-mono text-[10px] sm:text-xs leading-normal text-stone-700 italic border-l-2 border-red-700 pl-3">
                      Press play to view the interactive live broadcast or raw press briefing footage.
                    </p>
                  </div>
                )}

                {article.image && !article.videoUrl && (
                  <div className="space-y-2 select-none">
                    <div className="relative group overflow-hidden border border-stone-400 p-1.5 bg-white shadow-sm">
                      <img
                        src={article.image}
                        alt={article.headline}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto max-h-[350px] object-cover filter contrast-[1.05]"
                      />
                      {/* Artistic physical layout target corners */}
                      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></span>
                      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500"></span>
                      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500"></span>
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></span>
                    </div>
                    {article.imageCaption && (
                      <p className="font-mono text-[10px] sm:text-xs leading-normal text-stone-700 italic border-l-2 border-red-700 pl-3">
                        {article.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Multitask columns for elite editorial look */}
                <div 
                  className={`font-serif text-stone-950 columns-1 md:columns-2 gap-8 col-fill-auto leading-relaxed antialiased ${getBodyFontClass()}`}
                >
                  {article.fullContent.map((paragraph, index) => {
                    const isFirst = index === 0;
                    return (
                      <p 
                        key={index} 
                        className={`mb-4 text-justify ${
                          isFirst 
                            ? 'first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:mr-2.5 first-letter:text-red-700 first-letter:font-serif first-letter:mt-1 first-letter:px-1 first-letter:bg-red-50 first-letter:rounded' 
                            : ''
                        }`}
                      >
                        {isFirst ? (
                          <>
                            <strong className="font-mono text-xs font-bold text-red-700 mr-1 tracking-wider uppercase">
                              [{article.location}]
                            </strong>
                            {paragraph}
                          </>
                        ) : paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Editorial disclaimer seal */}
                <div className="border border-stone-300 p-3 bg-stone-50 select-none flex items-start gap-2.5 rounded-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold tracking-wider text-stone-850">
                      Nigeria Press Council Standard Note
                    </h5>
                    <p className="font-sans text-[11px] text-stone-600 leading-normal mt-0.5">
                      This coverage conforms strictly to the Code of Professional Ethics for Nigerian Journalists. Opinions expressed in editorial columns do not necessarily reflect the official stance of The Daily Chronicle&apos;s trustees.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right-hand column: Ink Pen Margins / Annotations (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Simulated Ink Annotations Card */}
                <div 
                  className="bg-amber-50/70 p-4 rounded border border-amber-200/60 shadow-sm relative rotate-1"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  <div className="flex items-center gap-1.5 mb-3 border-b border-amber-205 pb-2">
                    <Feather className="w-4 h-4 text-blue-800" />
                    <h4 className="font-serif italic font-bold text-stone-900 text-sm">
                      Press Room Margins
                    </h4>
                  </div>
                  
                  <p className="font-sans text-[11px] text-stone-700 italic leading-relaxed mb-4">
                    Simulate scratching annotations, questions, or notes on this newspaper&apos;s physical margin. Saved to local storage.
                  </p>

                  {/* Existing annotations */}
                  {annotations.length > 0 ? (
                    <div className="space-y-2 mb-4 max-h-[160px] overflow-y-auto pr-1">
                      {annotations.map((note, idx) => (
                        <div 
                          key={idx} 
                          className="bg-sky-50 text-sky-900 text-[11px] py-1.5 px-2.5 rounded-sm font-sans italic border-l-2 border-sky-600 shadow-xs relative"
                        >
                          &ldquo;{note}&rdquo;
                          <span className="block text-[8px] font-mono text-sky-500 text-right mt-1">— Reader dispatch</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-amber-600 italic bg-amber-100/50 p-2.5 rounded text-center mb-4 leading-normal">
                      ✒️ Margin currently clean. Double click anywhere or type below to annotate.
                    </div>
                  )}

                  {/* Add fresh margin note */}
                  <form onSubmit={handleAddAnnotation} className="space-y-2">
                    <textarea
                      placeholder="Add handwritten margin note..."
                      value={annotation}
                      onChange={(e) => setAnnotation(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded p-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 italic placeholder:text-stone-400 font-sans"
                      rows={2.5}
                    />
                    <div className="flex justify-between items-center gap-2">
                      {annotations.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAnnotations}
                          className="text-[9px] font-mono text-red-700 hover:underline uppercase cursor-pointer"
                        >
                          Erase Marks
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-mono text-[10px] font-bold px-3 py-1 rounded transition ml-auto cursor-pointer flex items-center gap-1"
                      >
                        Write Ink
                      </button>
                    </div>
                  </form>
                </div>

                {/* Micro Ad space on reader column */}
                <div className="bg-stone-100 p-3 rounded-sm border border-stone-300 text-center select-none space-y-1">
                  <div className="text-[8px] font-mono text-stone-400 uppercase tracking-widest font-bold">SPONSORED COLUMNS</div>
                  <p className="font-serif font-black text-[11.5px] uppercase text-stone-900 tracking-tight leading-none">
                    Gbenga & Sons Cement
                  </p>
                  <p className="font-sans text-[10px] text-stone-600">
                    Strong foundations since colonial independence. Standard 50KG blocks.
                  </p>
                  <button className="text-[9px] font-mono text-red-750 font-bold hover:underline cursor-pointer">
                    LOCATE DISTRIBUTORS →
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Foot of paper page */}
        <div className="bg-stone-150 p-4 border-t border-stone-300 select-none text-center font-mono text-[10px] text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Printed and archived for Digital Reference, {article.location} District.</span>
          <span className="font-bold text-stone-900 uppercase">THE DAILY CHRONICLE 2026</span>
        </div>
      </div>
    </div>
  );
}
