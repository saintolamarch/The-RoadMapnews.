import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Eye, Calendar, User, Bookmark } from 'lucide-react';
import { NewsArticle } from '../data/allArticles';

interface HomeSectionProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  bookmarkedIds: string[];
  onBookmarkToggle: (id: string) => void;
  activeTheme?: 'editorial' | 'magazine' | 'cyber';
}

export default function HomeSection({ articles, onArticleClick, bookmarkedIds, onBookmarkToggle, activeTheme = 'magazine' }: HomeSectionProps) {
  const isCyber = activeTheme === 'cyber';
  const published = articles.filter(a => !a.isDraft);
  const heroArticle = published.find(a => a.isHero) || published[0];
  const listArticles = published.filter(a => a.id !== heroArticle?.id);
  const trendingArticles = [...published].sort((a, b) => b.views - a.views).slice(0, 4);
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setSubscribedMessage(true);
      setNewsEmail('');
      setTimeout(() => setSubscribedMessage(false), 5000);
    }
  };

  return (
    <div className="space-y-8">

      {/* Hero Headline Section */}
      {heroArticle && (
        <div className={`grid grid-cols-1 gap-6 items-start border-b pb-8 ${isCyber ? 'border-stone-850' : 'border-stone-200'}`}>
          {/* Main Hero article */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 animate-pulse-once">
              <span className="bg-red-650 text-white text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md tracking-widest">
                {heroArticle.category.toUpperCase()}
              </span>
              <span className="text-stone-400 font-mono text-xs">•</span>
              <span className={`font-mono text-xs ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>{heroArticle.location}</span>
              <span className="text-stone-404 font-mono text-xs">•</span>
              <span className={`font-mono text-xs ${isCyber ? 'text-stone-400' : 'text-stone-500'}`}>{heroArticle.readTime}</span>
            </div>

            <h1 
              onClick={() => onArticleClick(heroArticle)}
              className={`font-black text-xl sm:text-2.5xl md:text-3.5xl lg:text-4.5xl leading-none tracking-tight cursor-pointer transition duration-250 ${
                isCyber ? 'text-white hover:text-red-500' : 'text-stone-950 hover:text-[#E31B23]'
              }`}
              id="hero-article-headline"
            >
              {heroArticle.headline}
            </h1>

            <p className={`font-serif italic text-base leading-relaxed font-semibold ${isCyber ? 'text-stone-300' : 'text-stone-700'}`}>
              {heroArticle.subheading}
            </p>

            <div className={`relative group rounded-3xl overflow-hidden border p-1 ${isCyber ? 'border-stone-800 bg-[#161618]' : 'border-stone-200 bg-stone-50'}`}>
              <img 
                src={heroArticle.image} 
                alt={heroArticle.headline} 
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-xl filter saturate-[0.9] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 select-none text-white">
                <p className="text-xs font-mono opacity-80">{heroArticle.imageCaption}</p>
              </div>
            </div>

            <p className={`text-sm leading-relaxed inline-block ${isCyber ? 'text-stone-300' : 'text-stone-800'}`}>
              {heroArticle.snippet}{" "}
              <button 
                onClick={() => onArticleClick(heroArticle)} 
                className="text-red-655 hover:underline text-xs font-black font-mono inline"
              >
                [CONTINUE READING...]
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Latest Feed News Section: Beautiful cards */}
      <div className="space-y-4">
        <div className={`pb-3 border-b ${isCyber ? 'border-zinc-800' : 'border-stone-300'}`}>
          <h3 className={`font-extrabold text-base tracking-tight uppercase ${isCyber ? 'text-white' : 'text-stone-950'}`}>
            Latest News Dispatch
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listArticles.slice(0, 6).map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <article 
                key={article.id} 
                className={`border hover:shadow-xs rounded-2xl p-4 pt-4 flex flex-col justify-between transition-all duration-250 group ${
                  isCyber 
                    ? 'bg-zinc-900/60 border-zinc-850 hover:border-zinc-700 hover:bg-[#1c1c1f]/85 text-stone-105' 
                    : 'bg-white border-stone-200 hover:border-stone-350 text-stone-900'
                }`}
              >
                <div className="space-y-3">
                  <div className={`relative rounded-xl overflow-hidden aspect-video border ${
                    isCyber ? 'border-zinc-800' : 'border-stone-150'
                  }`}>
                    <img 
                      src={article.image} 
                      alt={article.headline} 
                      className="w-full h-full object-cover filter saturate-[0.8] group-hover:scale-103 duration-300 transition"
                    />
                    <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs text-white text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>{article.location}</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 
                    onClick={() => onArticleClick(article)}
                    className={`font-bold text-sm leading-snug cursor-pointer transition ${
                      isCyber ? 'text-stone-100 group-hover:text-red-400' : 'text-stone-900 group-hover:text-[#E31B23]'
                    }`}
                  >
                    {article.headline}
                  </h3>

                  <p className={`text-[11.5px] leading-relaxed ${isCyber ? 'text-stone-400' : 'text-stone-650'}`}>
                    {article.snippet}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                  isCyber ? 'border-zinc-800/80' : 'border-stone-100'
                }`}>
                  <button 
                    onClick={() => onArticleClick(article)}
                    className={`text-xs font-bold transition flex items-center ${
                      isCyber ? 'text-stone-300 hover:text-red-400' : 'text-stone-850 hover:text-red-755'
                    }`}
                  >
                    View Story →
                  </button>

                  <button 
                    onClick={() => onBookmarkToggle(article.id)}
                    className="text-stone-400 hover:text-red-700 transition p-1 cursor-pointer"
                    title="Bookmark Story"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-red-650 text-red-655 font-bold' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Elegant Highlights per Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Category Spot: Business */}
        <div className="border border-stone-200 rounded-2xl bg-stone-50/50 p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <h4 className="font-extrabold text-xs font-mono uppercase tracking-widest text-[#ea1c24]">
              Finance & Markets
            </h4>
            <span className="text-[10px] text-stone-500">BUSINESS SEALS</span>
          </div>
          {published.filter(a => a.category === 'business').slice(0, 2).map(art => (
            <div key={art.id} className="space-y-1 pb-3 last:pb-0 last:border-0 border-b border-stone-150">
              <h5 
                onClick={() => onArticleClick(art)}
                className="font-bold text-xs sm:text-[13px] hover:text-red-700 cursor-pointer transition text-stone-900"
              >
                {art.headline}
              </h5>
              <div className="flex items-center gap-2 font-mono text-[9px] text-stone-500">
                <span>{art.location}</span>
                <span>•</span>
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Spot: Sports & Lifestyle */}
        <div className="border border-stone-200 rounded-2xl bg-stone-50/50 p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <h4 className="font-extrabold text-xs font-mono uppercase tracking-widest text-[#ea1c24]">
              Arena & Culture
            </h4>
            <span className="text-[10px] text-stone-500">SPORTS & CELEBRITY</span>
          </div>
          {published.filter(a => a.category === 'sports' || a.category === 'entertainment').slice(0, 2).map(art => (
            <div key={art.id} className="space-y-1 pb-3 last:pb-0 last:border-0 border-b border-stone-150">
              <h5 
                onClick={() => onArticleClick(art)}
                className="font-bold text-xs sm:text-[13px] hover:text-red-700 cursor-pointer transition text-stone-900"
              >
                {art.headline}
              </h5>
              <div className="flex items-center gap-2 font-mono text-[9px] text-stone-500">
                <span>{art.location}</span>
                <span>•</span>
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
