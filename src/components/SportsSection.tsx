import React from 'react';
import { Newspaper, BookOpen, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../data/allArticles';

interface SportsSectionProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export default function SportsSection({ articles, onArticleClick }: SportsSectionProps) {
  const sportsArticles = articles.filter(a => a.category === 'sports' && !a.isDraft);
  const featuredSports = sportsArticles[0];
  const secondarySports = sportsArticles.slice(1);

  return (
    <div className="space-y-10 font-sans">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4 select-none">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight uppercase">
          Sports Dispatch
        </h2>
        <p className="text-xs text-stone-550 font-mono mt-1">
          National league grids, international qualifications, and professional athletic achievements coverage.
        </p>
      </div>

      {!featuredSports ? (
        <div className="p-12 border border-dashed border-stone-250 rounded-2xl text-center font-mono text-xs text-stone-500 select-none">
          No sports news available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-sans">
          
          {/* Main Headline Story */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500">
                <span className="text-red-655 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Newspaper className="w-3.5 h-3.5" /> Sports Reporter
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {featuredSports.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {featuredSports.date}
                </span>
              </div>

              <h3 
                onClick={() => onArticleClick(featuredSports)}
                className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-stone-900 leading-tight hover:text-red-755 cursor-pointer transition duration-150"
              >
                {featuredSports.headline}
              </h3>

              <p className="font-serif italic text-sm text-stone-700 font-medium leading-relaxed">
                {featuredSports.subheading}
              </p>
            </div>

            {featuredSports.image && (
              <div 
                onClick={() => onArticleClick(featuredSports)}
                className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50 cursor-pointer group"
              >
                <img 
                  src={featuredSports.image} 
                  alt={featuredSports.headline} 
                  className="w-full h-[240px] sm:h-[320px] object-cover filter saturate-[0.85] contrast-[1.01] group-hover:scale-[1.01] transition-transform duration-300"
                />
                {featuredSports.imageCaption && (
                  <p className="text-[10px] font-mono text-stone-500 italic p-2 border-t border-stone-100 bg-stone-50/50">
                    {featuredSports.imageCaption}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-stone-850 leading-relaxed text-justify">
              {featuredSports.snippet} {featuredSports.content ? featuredSports.content.substring(0, 180) + "..." : ""}
            </p>

            <button
              onClick={() => onArticleClick(featuredSports)}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white text-xs font-mono font-bold py-2.5 px-4 rounded-xl cursor-pointer transition shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Full Column
            </button>
          </div>

          {/* List of Remaining Sports Articles */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-505 border-b border-stone-200 pb-2 flex items-center gap-1.5 select-none">
              More Sports Reports
            </h4>

            {secondarySports.length > 0 ? (
              <div className="space-y-6 divide-y divide-stone-150">
                {secondarySports.map((art, idx) => (
                  <div 
                    key={art.id} 
                    className={`space-y-2.5 ${idx > 0 ? 'pt-6' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-stone-505">
                      <span className="flex items-center gap-1 text-stone-700">
                        <MapPin className="w-2.5 h-2.5" /> {art.location}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>

                    <h5 
                      onClick={() => onArticleClick(art)}
                      className="font-serif font-bold text-base text-stone-900 hover:text-red-750 transition cursor-pointer leading-snug"
                    >
                      {art.headline}
                    </h5>

                    <p className="text-xs text-stone-650 line-clamp-2 leading-relaxed">
                      {art.snippet}
                    </p>

                    <button 
                      onClick={() => onArticleClick(art)}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-red-655 hover:text-red-750 transition"
                    >
                      Read full report <ArrowRight className="w-3 h-3 text-red-650" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-dashed border-stone-200 rounded-xl text-center font-mono text-xs text-stone-400 select-none">
                No accompanying bulletins available.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
