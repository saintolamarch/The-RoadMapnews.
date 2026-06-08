import React, { useState } from 'react';
import { 
  Search, Newspaper, Lock, Menu, X
} from 'lucide-react';


interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoggedIn: boolean;
  onAdminLoginClick: () => void;
  activeTheme?: 'editorial' | 'magazine' | 'cyber';
  onThemeChange?: (theme: 'editorial' | 'magazine' | 'cyber') => void;
}

export default function NewspaperHeader({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  onAdminLoginClick,
  activeTheme = 'magazine',
  onThemeChange
}: HeaderProps) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCyber = activeTheme === 'cyber';
  const isMagazine = activeTheme === 'magazine';
  const isEditorial = activeTheme === 'editorial';

  const textTitleColor = isCyber ? 'text-white' : 'text-stone-900';
  const borderToneClass = isCyber ? 'border-stone-850' : isMagazine ? 'border-stone-150' : 'border-stone-200/90';

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'politics', label: 'Politics' },
    { id: 'business', label: 'Business' },
    { id: 'sports', label: 'Sports' },
    { id: 'education', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'submit-news', label: 'Submit News' }
  ];

  return (
    <header className={`w-full bg-transparent flex flex-col font-sans select-none border-b transition-all duration-300 ${isCyber ? 'border-stone-850' : 'border-stone-200/80'} pb-1`}>
      
      {/* Bold Modern Red and Black Newspaper Logo */}
      <div className="text-center my-6 flex flex-col items-center justify-center px-4 relative">
        <div 
          onClick={() => setCurrentTab('home')} 
          className="cursor-pointer select-none space-y-3 group"
        >
          {/* Elegant Logo Plate */}
          <div className="flex items-center justify-center select-none">
            {/* Iconic Solid Red plate */}
            <div className="bg-[#E31B23] text-white font-sans font-black text-3xl sm:text-4xl md:text-5xl px-6 py-3 tracking-tighter leading-none shadow-md hover:scale-102 duration-250 transition-transform rounded-xs">
              TheRoadMapNews
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MAIN NAVIGATION BAR */}
      <div className={`sticky top-0 z-40 border-t border-b my-2 py-1 px-4 flex items-center justify-between gap-4 transition-colors duration-300 ${borderToneClass} ${
        isCyber ? 'bg-stone-950/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md shadow-xs'
      }`}>
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {menuItems.map((item) => {
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'admin' && !isLoggedIn) {
                    onAdminLoginClick();
                  } else {
                    setCurrentTab(item.id);
                  }
                }}
                className={`px-3.5 py-1.5 text-xs font-mono font-extrabold transition-all duration-200 cursor-pointer rounded-full flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-red-655 text-white shadow-md shadow-red-500/20'
                    : isCyber 
                      ? 'text-stone-300 hover:bg-stone-900 hover:text-white' 
                      : 'text-stone-705 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                {item.id === 'admin' && (
                  <Lock className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-amber-500'} fill-current`} />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-xl border border-stone-250 cursor-pointer text-stone-700 hover:text-stone-950 transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 animate-spin-slow" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Live Search autocomplete input bar */}
        <div className="relative shrink-0 w-[100px] sm:w-[140px] flex items-center">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-full py-1 pl-6.5 pr-6 text-[10.5px] font-sans transition placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
              isCyber 
                ? 'bg-stone-950 border-stone-850 text-white' 
                : 'bg-stone-50 border-stone-200 text-stone-950 shadow-inner'
            }`}
          />
          <Search className="w-3 h-3 text-stone-400 absolute left-2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden flex flex-col p-3 border-b border-stone-300 space-y-1 bg-stone-100/90 backdrop-blur-md rounded-b-2xl select-all scale-100 duration-200 transition ${
          isCyber ? 'bg-stone-950 text-stone-300 border-stone-850' : 'bg-white text-stone-900'
        }`}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.id === 'admin' && !isLoggedIn) {
                  onAdminLoginClick();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`w-full text-left py-2 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                currentTab === item.id 
                  ? 'bg-red-655 text-white' 
                  : 'hover:bg-stone-100/50'
              }`}
            >
              {item.id === 'admin' && (
                <Lock className={`w-3.5 h-3.5 ${currentTab === item.id ? 'text-white' : 'text-amber-500'} fill-current`} />
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
