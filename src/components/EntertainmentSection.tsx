import React from 'react';
import { Newspaper, BookOpen, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../data/allArticles';

interface EntertainmentSectionProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export default function EntertainmentSection({ articles, onArticleClick }: EntertainmentSectionProps) {
  const entArticles = articles.filter(a => a.category === 'entertainment' && !a.isDraft);
  const featured = entArticles[0];
  const secondary = entArticles.slice(1);

  return (
    <div className="space-y-10 font-sans">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4 select-none">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight uppercase">
          Arts &amp; Culture
        </h2>
        <p className="text-xs text-stone-550 font-mono mt-1">
          Nollywood reports, national musical achievements, fine arts reviews, and lifestyle coverage.
        </p>
      </div>

      {!featured ? (
        <div className="p-12 border border-dashed border-stone-250 rounded-2xl text-center font-mono text-xs text-stone-500 select-none">
          No entertainment articles available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Headline Story */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500">
                <span className="text-red-655 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Newspaper className="w-3.5 h-3.5" /> Culture Desk
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {featured.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {featured.date}
                </span>
              </div>

              <h3 
                onClick={() => onArticleClick(featured)}
                className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-stone-900 leading-tight hover:text-red-755 cursor-pointer transition duration-150"
              >
                {featured.headline}
              </h3>

              <p className="font-serif italic text-sm text-stone-700 font-medium leading-relaxed">
                {featured.subheading}
              </p>
            </div>

            {featured.image && (
              <div 
                onClick={() => onArticleClick(featured)}
                className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50 cursor-pointer group"
              >
                <img 
                  src={featured.image} 
                  alt={featured.headline} 
                  className="w-full h-[240px] sm:h-[320px] object-cover filter saturate-[0.85] contrast-[1.01] group-hover:scale-[1.01] transition-transform duration-300"
                />
                {featured.imageCaption && (
                  <p className="text-[10px] font-mono text-stone-500 italic p-2 border-t border-stone-100 bg-stone-50/50">
                    {featured.imageCaption}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-stone-850 leading-relaxed text-justify">
              {featured.snippet} {featured.content ? featured.content.substring(0, 180) + "..." : ""}
            </p>

            <button
              onClick={() => onArticleClick(featured)}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white text-xs font-mono font-bold py-2.5 px-4 rounded-xl cursor-pointer transition shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Full Review
            </button>
          </div>

          {/* List of Remaining Arts Articles */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-505 border-b border-stone-200 pb-2 flex items-center gap-1.5 select-none">
              Additional Features
            </h4>

            {secondary.length > 0 ? (
              <div className="space-y-6 divide-y divide-stone-150">
                {secondary.map((art, idx) => (
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
                      Read full column <ArrowRight className="w-3 h-3 text-red-650" />
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
