import React, { useState, useEffect } from 'react';
import { 
  Award, Globe, Phone, Mail, Facebook, Instagram, Twitter, Shield, Lock, Bell, Check, X, AlertCircle, Bookmark, MessageCircle 
} from 'lucide-react';
import { 
  NewsArticle, INITIAL_NEWS_ARTICLES, INITIAL_COMMENTS, STOCKS_DATA, Comment 
} from './data/allArticles';
import { sha256 } from './utils/crypto';
import {
  isSupabaseConfigured,
  dbFetchArticles,
  dbUpsertArticle,
  dbDeleteArticle,
  dbFetchAllComments,
  dbUpsertComment,
  dbDeleteComment
} from './utils/supabase';
import NewspaperHeader from './components/NewspaperHeader';
import ReadingModal from './components/ReadingModal';
import HomeSection from './components/HomeSection';
import PoliticsSection from './components/PoliticsSection';
import BusinessSection from './components/BusinessSection';
import SportsSection from './components/SportsSection';
import EducationSection from './components/EducationSection';
import EntertainmentSection from './components/EntertainmentSection';
import ContactSection from './components/ContactSection';
import DashboardSection from './components/DashboardSection';


export default function App() {
  
  // Current active navigation tab / page routing
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('arn-active-tab');
    return saved || 'home';
  });

  useEffect(() => {
    localStorage.setItem('arn-active-tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentTab('admin');
      }
    };
    // Check initial hash state on page load
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Master articles array synced to local persistence
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('arn-news-articles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_NEWS_ARTICLES; }
    }
    return INITIAL_NEWS_ARTICLES;
  });

  // Master comments array synced to local storage
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('arn-comments-registry');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_COMMENTS; }
    }
    return INITIAL_COMMENTS;
  });

  // Fetch from Supabase at mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const loadSupabaseData = async () => {
        try {
          const liveArticles = await dbFetchArticles(articles);
          setArticles(liveArticles);
          localStorage.setItem('arn-news-articles', JSON.stringify(liveArticles));

          const liveComments = await dbFetchAllComments(comments);
          setComments(liveComments);
          localStorage.setItem('arn-comments-registry', JSON.stringify(liveComments));
        } catch (e) {
          console.error('Failed to load Supabase data:', e);
        }
      };
      loadSupabaseData();
    }
  }, []);

  const handleUpdateArticles = (updated: NewsArticle[]) => {
    const previous = [...articles];
    setArticles(updated);
    localStorage.setItem('arn-news-articles', JSON.stringify(updated));

    // Async sync with Supabase
    if (isSupabaseConfigured()) {
      // Find deleted
      const deleted = previous.filter(oldArt => !updated.some(newArt => newArt.id === oldArt.id));
      deleted.forEach(oldArt => dbDeleteArticle(oldArt.id));

      // Find changed or new
      const changedOrNew = updated.filter(newArt => {
        const matchingOld = previous.find(oldArt => oldArt.id === newArt.id);
        if (!matchingOld) return true; // New
        return JSON.stringify(matchingOld) !== JSON.stringify(newArt);
      });
      changedOrNew.forEach(art => dbUpsertArticle(art));
    }
  };

  const handleUpdateComments = (updated: Comment[]) => {
    const previous = [...comments];
    setComments(updated);
    localStorage.setItem('arn-comments-registry', JSON.stringify(updated));

    // Async sync with Supabase
    if (isSupabaseConfigured()) {
      // Find deleted
      const deleted = previous.filter(oldComm => !updated.some(newComm => newComm.id === oldComm.id));
      deleted.forEach(oldComm => dbDeleteComment(oldComm.id));

      // Find changed or new
      const changedOrNew = updated.filter(newComm => {
        const matchingOld = previous.find(oldComm => oldComm.id === newComm.id);
        if (!matchingOld) return true; // New
        return JSON.stringify(matchingOld) !== JSON.stringify(newComm);
      });
      changedOrNew.forEach(comm => dbUpsertComment(comm));
    }
  };

  // Authentication State with secure Ola12345 credential verification
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('arn-admin-logged-in') === 'true';
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword.trim();

    // Verify using secure internal cryptographic SHA-256 hashes
    const defaultHash = sha256('Ola12345');
    const storedHash = localStorage.getItem('arn-admin-hash') || defaultHash;
    const inputHash = sha256(pass);

    if (user === 'admin' && inputHash === storedHash) {
      setIsLoggedIn(true);
      localStorage.setItem('arn-admin-logged-in', 'true');
      setShowLoginModal(false);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      // Route immediately to Admin Panel upon successful authentication
      setCurrentTab('admin');
    } else {
      setLoginError('Invalid Administrator credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('arn-admin-logged-in');
    setCurrentTab('home');
  };

  // Theme support
  const [activeTheme, setActiveTheme] = useState<'editorial' | 'magazine' | 'cyber'>(() => {
    const saved = localStorage.getItem('arn-active-theme');
    return (saved as 'editorial' | 'magazine' | 'cyber') || 'magazine';
  });

  const handleSetTheme = (theme: 'editorial' | 'magazine' | 'cyber') => {
    setActiveTheme(theme);
    localStorage.setItem('arn-active-theme', theme);
  };

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetLayout = () => {
    setSearchQuery('');
    setActiveTheme('magazine');
    localStorage.setItem('arn-active-theme', 'magazine');
    setCurrentTab('home');
  };

  // Article reader modal states
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('arn-bookmarked-ids');
    return saved ? JSON.parse(saved) : [];
  });

  const handleBookmarkToggle = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(bId => bId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem('arn-bookmarked-ids', JSON.stringify(updated));
  };

  // Background and design definitions
  const isCyber = activeTheme === 'cyber';
  const isMagazine = activeTheme === 'magazine';
  const isEditorial = activeTheme === 'editorial';

  const getScreenBgClass = () => {
    switch (activeTheme) {
      case 'cyber': return 'bg-[#09090b] text-[#e4e4e7]';
      case 'magazine': return 'bg-[#f4f4f7] text-[#1c1917]';
      case 'editorial':
      default:
        return 'bg-[#f5f4f0] text-[#1c1917]';
    }
  };

  const getPageWrapperClass = () => {
    switch (activeTheme) {
      case 'cyber': return 'bg-[#121214] border border-stone-850 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl';
      case 'magazine': return 'bg-white border border-stone-200 p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100/50';
      case 'editorial':
      default:
        return 'newsprint-aged border border-stone-300 p-4 sm:p-6 md:p-8 rounded-xl shadow-md';
    }
  };

  // Cast selected NewsArticle to full Article model to keep ReadingModal fully typesafe
  const mappedArticleForModal = selectedArticle ? {
    id: selectedArticle.id,
    category: selectedArticle.category as any,
    headline: selectedArticle.headline,
    subheading: selectedArticle.subheading,
    snippet: selectedArticle.snippet,
    fullContent: selectedArticle.content ? selectedArticle.content.split('\n') : [selectedArticle.snippet],
    byline: selectedArticle.byline,
    date: selectedArticle.date,
    location: selectedArticle.location,
    readTime: selectedArticle.readTime,
    image: selectedArticle.image,
    imageCaption: selectedArticle.imageCaption,
    videoUrl: selectedArticle.videoUrl,
    isBreaking: selectedArticle.isBreaking,
    isHero: selectedArticle.isHero
  } : null;

  return (
    <div className={`min-h-screen ${getScreenBgClass()} flex flex-col items-center justify-start py-4 px-2 sm:px-4 md:py-8 font-sans transition-all duration-300`}>
      
      {/* Decorative calibration grids for executive feel */}
      <div className="hidden xl:flex fixed left-5 top-28 flex-col gap-2 items-center select-none z-10 opacity-70">
        <span className="w-3.5 h-3.5 rounded-full bg-cyan-600 block"></span>
        <span className="w-3.5 h-3.5 rounded-full bg-pink-600 block"></span>
        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 block"></span>
        <span className="w-3.5 h-3.5 rounded-full bg-stone-900 block"></span>
        <div className="w-[1px] h-12 bg-stone-500"></div>
        <span className="text-[10px] font-mono text-stone-500 font-bold -rotate-90 origin-left translate-y-7 block">
          METRIC ALIGN
        </span>
      </div>

      {/* Main Core Container */}
      <div className="w-full max-w-7xl space-y-6">

        {/* Global Newsroom Web Layout Sheet */}
        <div className={getPageWrapperClass()}>
          
          <NewspaperHeader
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoggedIn={isLoggedIn}
            onAdminLoginClick={() => {
              if (isLoggedIn) {
                setCurrentTab('admin');
              } else {
                setShowLoginModal(true);
              }
            }}
            activeTheme={activeTheme}
            onThemeChange={handleSetTheme}
          />


          {/* DYNAMIC TAB ENGINES */}
          <main className="mt-8">
            {currentTab === 'home' && (
              <HomeSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
                bookmarkedIds={bookmarkedIds}
                onBookmarkToggle={handleBookmarkToggle}
                activeTheme={activeTheme}
              />
            )}

            {currentTab === 'politics' && (
              <PoliticsSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
              />
            )}

            {currentTab === 'business' && (
              <BusinessSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
              />
            )}

            {currentTab === 'sports' && (
              <SportsSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
              />
            )}

            {currentTab === 'education' && (
              <EducationSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
              />
            )}

            {currentTab === 'entertainment' && (
              <EntertainmentSection 
                articles={articles} 
                onArticleClick={(art) => setSelectedArticle(art)} 
              />
            )}

            {currentTab === 'contact' && (
              <ContactSection />
            )}

            {currentTab === 'admin' && (
              isLoggedIn ? (
                <DashboardSection
                  articles={articles}
                  comments={comments}
                  onUpdateArticles={handleUpdateArticles}
                  onUpdateComments={handleUpdateComments}
                  onLogout={handleLogout}
                  onViewNews={() => setCurrentTab('home')}
                />
              ) : (
                // Beautiful Embedded Auth Prompt if user directly visits Admin tab
                <div className="bg-stone-950 p-6 sm:p-10 border border-stone-850 rounded-2xl max-w-md mx-auto text-center space-y-4 select-none">
                  <Lock className="w-12 h-12 text-[#ea1c24] mx-auto animate-bounce" />
                  <h3 className="font-mono text-sm uppercase tracking-widest text-white font-extrabold">
                    Secure Administrator Terminal
                  </h3>
                  <p className="text-xs text-stone-400">
                    Access to the CMS database registers requires super-user validation.
                  </p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-red-655 hover:bg-red-700 text-white font-mono text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition shadow-md inline-block w-full"
                  >
                    Authenticate Session
                  </button>
                </div>
              )
            )}
          </main>

          {/* Core Footer Section */}
          <footer className="mt-12 pt-6 border-t border-stone-300 text-center font-mono text-xs text-stone-705 select-none">
            <p className="mt-2 text-[11px] text-stone-500 tracking-wider">
              &copy; 2026 THEroadMap News
            </p>
          </footer>

        </div>
      </div>

      {/* RENDER DYNAMIC ARTICLE READING MODAL OVERLAY */}
      {mappedArticleForModal && (
        <ReadingModal
          article={mappedArticleForModal}
          onClose={() => setSelectedArticle(null)}
          fontSizeClass="base"
          onBookmarkToggle={handleBookmarkToggle}
          isBookmarked={bookmarkedIds.includes(mappedArticleForModal.id)}
        />
      )}

      {/* DYNAMIC WP-INSPIRED LOGIN MODAL WITH Secure Ola12345 Password */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 flex items-center justify-center p-4 backdrop-blur-sm select-none">
          <div className="bg-[#f0f0f1] border border-stone-300 p-6 max-w-sm w-full rounded-2xl shadow-3xl space-y-5 font-sans text-stone-900 relative">
            
            <button 
              onClick={() => { setShowLoginModal(false); setLoginError(''); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-stone-200 rounded-full text-stone-500 hover:text-black transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex flex-col items-center gap-1.5 text-center select-none pt-2">
              <div className="w-14 h-14 rounded-full bg-[#1c2226] text-white flex items-center justify-center border-2 border-white shadow-md">
                <span className="font-extrabold text-3xl">W</span>
              </div>
              <h4 className="text-stone-900 font-extrabold text-sm uppercase tracking-wider font-mono">THEROADMAPNEWS PRESS CMS</h4>
              <p className="text-[10px] text-stone-500 font-mono">Authorized Admin authentication</p>
            </div>

            {loginError && (
              <div className="bg-rose-50 border-l-4 border-[#ea1c24] text-rose-900 p-2.5 rounded-r text-[11px] font-bold select-none animate-pulse">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1 bg-white p-2.5 rounded-xl border border-stone-300 shadow-inner">
                <label className="block text-[9px] font-mono font-bold uppercase text-stone-550">Administrator Username</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent text-stone-950 font-bold focus:outline-none py-0.5 text-sm"
                />
              </div>

              <div className="space-y-1 bg-white p-2.5 rounded-xl border border-stone-300 shadow-inner">
                <label className="block text-[9px] font-mono font-bold uppercase text-stone-550">Secure Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-stone-950 font-bold focus:outline-none py-0.5 text-sm"
                />
              </div>

              {/* Secure Credentials Info Panel */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[10px] text-stone-704 leading-relaxed font-sans">
                <strong className="text-stone-900 font-bold block mb-1">🔐 Required Login Credentials:</strong>
                Username is <strong className="text-stone-950 underline decoration-red-655 uppercase">admin</strong> and Password is <strong className="text-[#ea1c24] font-black">Ola12345</strong>.
              </div>

              <button
                type="submit"
                className="w-full bg-red-655 hover:bg-red-700 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                Authenticate Credentials
              </button>
            </form>

            <div className="text-center text-[10px] text-stone-450 border-t border-stone-200 pt-3 select-none">
              <a href="#reset" className="hover:text-stone-700 hover:underline">Lost access pipeline keys?</a>
              <span className="mx-2">|</span>
              <a href="#back" onClick={(e) => { e.preventDefault(); setShowLoginModal(false); }} className="hover:text-stone-700 hover:underline">← Exit back to TheRoadMapNews Home</a>
            </div>

          </div>
        </div>
      )}

      {/* HOVERING WHATSAPP ICON */}
      <a
        id="whatsapp-hover-button"
        href="https://wa.me/2348164871518"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
        title="Chat with us on WhatsApp"
      >
        {/* Animated outer radiating ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-75 group-hover:opacity-0 transition-opacity"></span>
        <MessageCircle className="w-7 h-7 relative z-10 fill-white stroke-[#25D366] stroke-[2.5px]" />
        
        {/* Floating Tooltip bubble */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 origin-right whitespace-nowrap bg-[#121214] text-white text-[11px] font-bold font-mono py-1.5 px-3 rounded-xl shadow-lg transition-all duration-200 pointer-events-none">
          WhatsApp Editorial Desk
        </span>
      </a>

    </div>
  );
}
