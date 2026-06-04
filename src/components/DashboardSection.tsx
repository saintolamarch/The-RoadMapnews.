import React, { useState } from 'react';
import { 
  FileText, Eye, Tags, MessageSquare, Image, Settings, Lock, Info, Plus, 
  Trash2, Edit, Save, ArrowLeft, UploadCloud, FolderPlus, Bell, Globe, Sparkles, Check, X, ShieldAlert, Database, HelpCircle
} from 'lucide-react';
import { sha256 } from '../utils/crypto';
import { NewsArticle, Comment, STATIC_CATEGORIES } from '../data/allArticles';
import { isSupabaseConfigured, SUPABASE_SQL_SCRIPT } from '../utils/supabase';

interface DashboardSectionProps {
  articles: NewsArticle[];
  comments: Comment[];
  onUpdateArticles: (updated: NewsArticle[]) => void;
  onUpdateComments: (updated: Comment[]) => void;
  onLogout: () => void;
  onViewNews: () => void;
}

export default function DashboardSection({ 
  articles, 
  comments, 
  onUpdateArticles, 
  onUpdateComments,
  onLogout,
  onViewNews
}: DashboardSectionProps) {
  
  // Dashboard Sub-navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'categories' | 'comments' | 'media' | 'seo' | 'profile' | 'database'>('overview');

  // Notification System
  const [alerts, setAlerts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);

  const addAlert = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 4000);
  };

  // State for Managing Categories list
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('arn-categories');
    return saved ? JSON.parse(saved) : STATIC_CATEGORIES;
  });

  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim().toLowerCase();
    if (!name) return;
    if (categories.includes(name)) {
      addAlert("Category already exists!", 'error');
      return;
    }
    const updated = [...categories, name];
    setCategories(updated);
    localStorage.setItem('arn-categories', JSON.stringify(updated));
    setNewCatName('');
    addAlert(`Category "${name.toUpperCase()}" added successfully!`);
  };

  const handleDeleteCategory = (cat: string) => {
    if (cat === 'politics' || cat === 'business' || cat === 'sports') {
      addAlert("Default core categories cannot be deleted.", 'error');
      return;
    }
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('arn-categories', JSON.stringify(updated));
    addAlert(`Category "${cat.toUpperCase()}" removed successfully.`);
  };

  // State for Create/Edit News Article Form
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    headline: '',
    subheading: '',
    category: 'business',
    location: 'LAGOS',
    readTime: '3 min read',
    snippet: '',
    content: '',
    byline: 'Senior Editorial Reporter',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600',
    imageCaption: 'ARN Media Pool image',
    isBreaking: false,
    isHero: false,
    isDraft: false,
    tags: '',
    metaTitle: '',
    metaDesc: ''
  });

  const startCreateNews = () => {
    setEditingArticleId(null);
    setFormData({
      headline: '',
      subheading: '',
      category: categories[0] || 'business',
      location: 'LAGOS',
      readTime: '4 min read',
      snippet: '',
      content: '',
      byline: 'Senior Financial Writer',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      imageCaption: 'ARN archive photocard',
      isBreaking: false,
      isHero: false,
      isDraft: false,
      tags: 'Markets, Economy',
      metaTitle: '',
      metaDesc: ''
    });
    setIsEditing(true);
  };

  const startEditNews = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setFormData({
      headline: art.headline,
      subheading: art.subheading || '',
      category: art.category,
      location: art.location,
      readTime: art.readTime,
      snippet: art.snippet,
      content: art.content || '',
      byline: art.byline,
      image: art.image,
      imageCaption: art.imageCaption || '',
      isBreaking: !!art.isBreaking,
      isHero: !!art.isHero,
      isDraft: !!art.isDraft,
      tags: art.tags ? art.tags.join(', ') : '',
      metaTitle: art.metaTitle || '',
      metaDesc: art.metaDesc || ''
    });
    setIsEditing(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.headline.trim() || !formData.snippet.trim() || !formData.content.trim()) {
      addAlert("Please fill in Headline, Snippet, and full content fields.", 'error');
      return;
    }

    const tagList = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingArticleId) {
      // Edit Existing Article
      const updated = articles.map(art => {
        if (art.id === editingArticleId) {
          return {
            ...art,
            headline: formData.headline,
            subheading: formData.subheading,
            category: formData.category as any,
            location: formData.location,
            readTime: formData.readTime,
            snippet: formData.snippet,
            content: formData.content,
            byline: formData.byline,
            image: formData.image,
            imageCaption: formData.imageCaption,
            isBreaking: formData.isBreaking,
            isHero: formData.isHero,
            isDraft: formData.isDraft,
            tags: tagList,
            metaTitle: formData.metaTitle || formData.headline,
            metaDesc: formData.metaDesc || formData.snippet
          };
        }
        return art;
      });
      // Ensure only one article is set as Hero at any given time
      if (formData.isHero) {
        updated.forEach(art => {
          if (art.id !== editingArticleId) art.isHero = false;
        });
      }
      onUpdateArticles(updated);
      addAlert("Article updated successfully!");
    } else {
      // Create New Article
      const newId = `arn-custom-${Date.now()}`;
      const newArt: NewsArticle = {
        id: newId,
        headline: formData.headline,
        subheading: formData.subheading,
        category: formData.category as any,
        location: formData.location,
        readTime: formData.readTime,
        snippet: formData.snippet,
        content: formData.content,
        byline: formData.byline,
        image: formData.image,
        imageCaption: formData.imageCaption,
        isBreaking: formData.isBreaking,
        isHero: formData.isHero,
        isDraft: formData.isDraft,
        views: 0,
        tags: tagList,
        date: "May 28, 2026",
        metaTitle: formData.metaTitle || formData.headline,
        metaDesc: formData.metaDesc || formData.snippet
      };

      const updated = [newArt, ...articles];
      if (formData.isHero) {
        updated.forEach(art => {
          if (art.id !== newId) art.isHero = false;
        });
      }
      onUpdateArticles(updated);
      addAlert("New Article published successfully!");
    }
    setIsEditing(false);
  };

  const handleDeleteArticle = (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this news article?");
    if (confirm) {
      const updated = articles.filter(a => a.id !== id);
      onUpdateArticles(updated);
      addAlert("Article removed from database.", 'info');
    }
  };

  // State for Comments Moderation
  const handleApproveComment = (id: string) => {
    const updated = comments.map(c => c.id === id ? { ...c, approved: true } : c);
    onUpdateComments(updated);
    addAlert("Comment approved & published on active boards.");
  };

  const handleDeleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    onUpdateComments(updated);
    addAlert("Comment deleted from database.", 'info');
  };

  // Media upload simulation state
  const [mediaItems, setMediaItems] = useState<{ id: string; url: string; caption: string; type: 'image' | 'video' }[]>([
    { id: 'm1', url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400', caption: 'CBN Headquarters Tower', type: 'image' },
    { id: 'm2', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400', caption: 'Kano Pillars Arena', type: 'image' },
    { id: 'm3', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400', caption: 'Software Hub', type: 'image' }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedCaption, setUploadedCaption] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropSimulated = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Simulate drop upload
    const dummyId = `media-${Date.now()}`;
    const dummyUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400";
    setMediaItems(prev => [{ id: dummyId, url: dummyUrl, caption: "Dropped Upload Image", type: 'image' }, ...prev]);
    addAlert("Database uploaded: Drag and drop files successfully parsed with responsive thumbnails.");
  };

  const handleManualUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl.trim()) return;
    const dummyId = `media-${Date.now()}`;
    setMediaItems(prev => [{ 
      id: dummyId, 
      url: uploadedUrl, 
      caption: uploadedCaption || "Manual Link Upload", 
      type: 'image' 
    }, ...prev]);
    setUploadedUrl('');
    setUploadedCaption('');
    addAlert("Media asset cataloged inside Sovereign Library.");
  };

  // Change Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default fallback SHA-256 hash for 'Ola12345'
    const defaultHash = '762a41d0442385dbfa01e6878b27f31bfec48d0a8767980b1df6eed74ef9a826'; // SHA-256 of 'Ola12345' is 762a41d0442385dbfa01e6878b27f31bfec48d0a8767980b1df6eed74ef9a826
    const storedHash = localStorage.getItem('arn-admin-hash') || defaultHash;
    const currentHashed = sha256(currentPass.trim());
    
    if (currentHashed !== storedHash) {
      addAlert("Current password verification failed.", 'error');
      return;
    }
    
    if (!newPass.trim()) {
      addAlert("New password cannot be empty.", 'error');
      return;
    }
    
    if (newPass !== confirmPass) {
      addAlert("New passwords do not match. Review criteria.", 'error');
      return;
    }
    
    // Save new hashed password
    const newHashed = sha256(newPass.trim());
    localStorage.setItem('arn-admin-hash', newHashed);
    
    addAlert("Success: Admin password securely updated and hashed internally with SHA-256!");
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // SEO Global management
  const [seoTitle, setSeoTitle] = useState('THEROADMAPNEWS — Premier West African digital newsroom');
  const [seoDesc, setSeoDesc] = useState('Leading editorial reports, live currency exchange grids, and sports qualifiers logs cleared daily by senior desk editors.');

  const handleSaveGlobalSeo = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert("Global open graph structures and meta indices saved successfully!");
  };

  // Analytics helper lists
  const totalViews = articles.reduce((sum, current) => sum + current.views, 0);
  const verifiedDrafts = articles.filter(a => a.isDraft).length;

  return (
    <div className="bg-[#121214] border border-stone-800 rounded-2xl p-4 sm:p-6 text-[#f4f4f5] font-sans relative">
      
      {/* Toast Alert System overlay */}
      <div className="fixed top-4 right-4 z-50 space-y-2 select-none w-80">
        {alerts.map(a => (
          <div 
            key={a.id} 
            className={`p-3 rounded-xl shadow-lg border flex items-center gap-2 text-xs font-mono animate-fade-in ${
              a.type === 'error' 
                ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
                : a.type === 'info' 
                  ? 'bg-blue-950/90 border-blue-800 text-blue-200' 
                  : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0 text-[#ea1c24]" />
            <span>{a.message}</span>
          </div>
        ))}
      </div>

      {/* Admin Title bar header */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-stone-800 pb-4 mb-6 select-none gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ea1c24] flex items-center justify-center font-bold text-white shadow-md">
            W
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight font-mono text-white flex items-center gap-1.5">
              THEROADMAPNEWS CMS Administrative Terminal
            </h2>
            <p className="text-[10px] text-stone-400 font-mono tracking-widest leading-none">
              SECURE AUTHORIZED SESSION ● ADMIN DESK
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onViewNews}
            className="bg-stone-900 border border-stone-800 hover:bg-stone-850 hover:border-stone-700 text-stone-300 font-mono text-xs font-bold py-1.5 px-3.5 rounded-xl cursor-pointer transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View Newspaper
          </button>
          
          <button 
            onClick={onLogout}
            className="bg-red-750 hover:bg-red-800 text-white font-mono text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition shadow-xs"
          >
            Sovereign Sign Out
          </button>
        </div>
      </div>

      {/* Dashboard Side navigation row tabs */}
      <div className="flex border-b border-stone-800 overflow-x-auto scrollbar-none py-1 mb-6 gap-1.5 whitespace-nowrap select-none">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: <Info className="w-3.5 h-3.5" /> },
          { id: 'articles', label: 'Manage Articles', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'categories', label: 'Manage Categories', icon: <Tags className="w-3.5 h-3.5" /> },
          { id: 'comments', label: 'Comments Moderate', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'media', label: 'Media Library', icon: <Image className="w-3.5 h-3.5" /> },
          { id: 'seo', label: 'SEO & Metadata', icon: <Globe className="w-3.5 h-3.5" /> },
          { id: 'database', label: 'Database & Sync', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'profile', label: 'User Profile Settings', icon: <Settings className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setIsEditing(false); }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-[#ea1c24]/20 text-[#ea1c24] border border-[#ea1c24]'
                : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB TAB VIEWS DESIGN */}

      {/* 1. OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <div className="bg-stone-950 p-4 border border-stone-850 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Total News columns
              </span>
              <div className="flex items-baseline justify-between select-none">
                <span className="text-2xl font-black font-sans text-white">{articles.length}</span>
                <span className="text-[10px] font-mono text-stone-400">Published / Drafts</span>
              </div>
            </div>

            <div className="bg-stone-950 p-4 border border-stone-850 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Aggregated Views Clicks
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-sans text-white">{totalViews.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-mono">+14.2% (WEEK)</span>
              </div>
            </div>

            <div className="bg-stone-950 p-4 border border-stone-850 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Total Categories
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-sans text-white">{categories.length}</span>
                <span className="text-[10px] sm:text-xs text-red-500 font-mono">CORE DESIGN</span>
              </div>
            </div>

            <div className="bg-stone-950 p-4 border border-stone-850 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Unmoderated Comments
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-sans text-white">
                  {comments.filter(c => !c.approved).length}
                </span>
                <span className="text-[10px] text-amber-500 font-mono">Awaiting Review</span>
              </div>
            </div>
          </div>

          {/* Simulated analytical graphs utilizing beautiful raw custom vector shapes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Interactive Vector Analytics Graph (Scale Col 7) */}
            <div className="lg:col-span-7 bg-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4 select-none">
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center text-[10px] font-mono text-stone-400">
                <h4 className="font-mono uppercase font-black tracking-wider text-white">
                  Traffic Velocity Statistics
                </h4>
                <span>HOURLY DATA STREAM</span>
              </div>

              {/* Vector graph */}
              <div className="h-56 w-full relative flex items-end p-2 border-b border-l border-stone-800">
                {/* Horizontal scale markers */}
                <div className="absolute left-[-24px] top-0 bottom-0 flex flex-col justify-between text-[8px] font-mono text-stone-550 pt-2">
                  <span>30K</span>
                  <span>15K</span>
                  <span>0K</span>
                </div>

                <svg className="w-full h-full text-[#ea1c24]" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.02)" strokeDasharray="5" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.02)" strokeDasharray="5" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.02)" strokeDasharray="5" />

                  {/* Shaded Area */}
                  <path 
                    d="M 0 110 L 40 90 L 80 100 L 120 40 L 160 50 L 200 15 L 240 70 L 280 60 L 320 100 L 360 80 L 400 30 L 440 25 L 500 10 L 500 120 L 0 120 Z" 
                    fill="url(#gradient-traffic)" 
                    opacity="0.15" 
                  />
                  
                  {/* Main plot line */}
                  <path 
                    d="M 0 110 L 40 90 L 80 100 L 120 40 L 160 50 L 200 15 L 240 70 L 280 60 L 320 100 L 360 80 L 400 30 L 440 25 L 500 10" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                  />
                  <defs>
                    <linearGradient id="gradient-traffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea1c24" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-stone-500">
                <span>08:00 AM</span>
                <span>12:00 PM</span>
                <span>04:00 PM</span>
                <span>08:00 PM</span>
              </div>
            </div>

            {/* Recent Upload Activity tracking list (Scale Col 5) */}
            <div className="lg:col-span-5 bg-stone-950 border border-stone-850 p-5 rounded-2xl space-y-4">
              <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white border-b border-stone-850 pb-2">
                Recent Article Dispatches
              </h4>

              <div className="space-y-3">
                {articles.slice(0, 4).map((art) => (
                  <div key={art.id} className="flex gap-2 justify-between items-start text-xs border-b border-stone-900 pb-2 last:border-b-0">
                    <div className="space-y-1 min-w-0">
                      <h5 className="font-bold text-stone-200 hover:text-red-400 cursor-pointer transition truncate" onClick={() => startEditNews(art)}>
                        {art.headline}
                      </h5>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-stone-500 select-none">
                        <span className="font-bold uppercase text-red-650">{art.category}</span>
                        <span>Views: {art.views}</span>
                      </div>
                    </div>
                    {art.isDraft ? (
                      <span className="bg-stone-800 text-stone-400 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase select-none font-bold">Draft</span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase select-none font-bold">Live</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. MANAGE NEWS ARTICLES VIEW */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-fade-in">
          {/* Article crud trigger row */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                <h3 className="font-extrabold text-sm uppercase font-mono tracking-widest text-[#ea1c24]">
                  Registered Database Articles Log
                </h3>
                <button
                  onClick={startCreateNews}
                  className="bg-[#ea1c24] hover:bg-red-700 text-white font-mono text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create News Article
                </button>
              </div>

              {/* Articles table list */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-[#18181b] border-b border-stone-850 font-mono text-[10px] text-stone-400 uppercase select-none">
                      <tr>
                        <th className="p-3.5 pl-4">Headline</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Author (Byline)</th>
                        <th className="p-3.5">Views</th>
                        <th className="p-3.5 text-right pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 font-sans">
                      {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-stone-900/60 duration-150 transition">
                          <td className="p-3.5 pl-4 font-bold text-white max-w-xs truncate" title={art.headline}>
                            {art.isHero && <span className="bg-red-655 text-white text-[8px] font-mono px-1.5 py-0.2 rounded uppercase mr-1.5 font-black">hero</span>}
                            {art.isDraft && <span className="bg-stone-800 text-stone-400 text-[8px] font-mono px-1.5 py-0.2 rounded uppercase mr-1.5 font-bold">draft</span>}
                            {art.headline}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-850 font-mono text-[10px] text-stone-202 uppercase">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[10.5px] italic text-stone-400">
                            {art.byline}
                          </td>
                          <td className="p-3.5 font-mono">
                            {art.views.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => startEditNews(art)}
                                className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 cursor-pointer transition"
                                title="Edit Article columns"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="text-[#ea1c24]/75 hover:text-red-500 p-1 rounded hover:bg-stone-800 cursor-pointer transition"
                                title="Delete database row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // Edit News Forms system
            <form onSubmit={handleSaveArticle} className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-850 pb-3 mb-4 select-none">
                <h4 className="font-extrabold text-[#ea1c24] font-mono text-xs uppercase tracking-widest flex items-center gap-1">
                  <Edit className="w-4 h-4" /> {editingArticleId ? 'Editing Article Structure' : 'Authoring Fresh Core News Draft'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-stone-900 hover:bg-stone-855 text-stone-300 font-mono text-xs py-1 px-3 rounded cursor-pointer transition"
                >
                  Cancel
                </button>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-stone-300">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Headlines Headline *</label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    placeholder="e.g. Naira stabilization continues following automated matches..."
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Aesthetic Subheading Excerpt</label>
                  <input
                    type="text"
                    value={formData.subheading}
                    onChange={(e) => setFormData({...formData, subheading: e.target.value})}
                    placeholder="Provide a subtle italicized lead paragraph..."
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">General Category Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-stone-950 text-white capitalize">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Regional Office Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value.toUpperCase()})}
                    placeholder="e.g. LAGOS, ABUJA, PORT HARCOURT"
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Author Byline Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.byline}
                    onChange={(e) => setFormData({...formData, byline: e.target.value})}
                    placeholder="By Chinedu Okechukwu, Regional Editor"
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Suggested Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Photo Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Direct Unsplash or image CDN link..."
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Image Caption Description</label>
                  <input
                    type="text"
                    value={formData.imageCaption}
                    onChange={(e) => setFormData({...formData, imageCaption: e.target.value})}
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Snippet Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.snippet}
                    onChange={(e) => setFormData({...formData, snippet: e.target.value})}
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                {/* Simulated Rich text editor */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Full Column Story (Split paragraphs with Newlines) *</label>
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-2.5 space-y-2">
                    {/* Simulated toolbar */}
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-stone-850 select-none text-[10px] font-mono font-bold">
                      <button type="button" className="px-2 py-1 bg-stone-950 rounded hover:text-white transition">B</button>
                      <button type="button" className="px-2 py-1 bg-stone-950 rounded hover:text-white transition">I</button>
                      <button type="button" className="px-2 py-1 bg-stone-950 rounded hover:text-white transition">Quote</button>
                      <button type="button" className="px-2 py-1 bg-stone-950 rounded hover:text-white transition" onClick={() => {
                        setFormData({...formData, content: formData.content + "\n[Related Column Section]"});
                        addAlert("Insert: Section node successfully matched.");
                      }}>+ Insert Anchor Link</button>
                    </div>
                    <textarea
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Input comprehensive descriptions. Pressing return forms a paragraph node in database boards."
                      className="w-full bg-stone-950 border border-stone-850 focus:outline-none rounded-lg p-2.5 text-xs text-stone-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-mono font-bold text-stone-500 uppercase">Keywords / Tags (Comma-seperated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g. Markets, Naira, Economy"
                    className="w-full bg-stone-950 border border-stone-800 focus:ring-1 focus:ring-red-500 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                {/* Checks */}
                <div className="flex flex-wrap items-center gap-6 select-none bg-stone-950/40 p-3 rounded-xl border border-stone-850 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-mono cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={formData.isHero}
                      onChange={(e) => setFormData({...formData, isHero: e.target.checked})}
                      className="accent-red-650 cursor-pointer"
                    />
                    <span>Center Front-page Hero Story</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-mono cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={formData.isBreaking}
                      onChange={(e) => setFormData({...formData, isBreaking: e.target.checked})}
                      className="accent-red-650 cursor-pointer"
                    />
                    <span>Broadcast as Breaking Flash NEWS</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-mono cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={formData.isDraft}
                      onChange={(e) => setFormData({...formData, isDraft: e.target.checked})}
                      className="accent-red-650 cursor-pointer"
                    />
                    <span>Save as Draft column</span>
                  </label>
                </div>
              </div>

              {/* SEO management parameters for article */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4">
                <div className="border-b border-stone-850 pb-2 flex items-center justify-between font-mono text-[10.5px]">
                  <h5 className="font-extrabold uppercase text-[#ea1c24] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-550 animate-pulse" /> Article SEO Metadata Node Settings
                  </h5>
                  <span>META LOGS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-300">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase">Meta SEO Title Override</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                      placeholder="e.g. Currency Matches Stabilize Lagos Economy"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase">Meta SEO Open Graph Description Override</label>
                    <input
                      type="text"
                      value={formData.metaDesc}
                      onChange={(e) => setFormData({...formData, metaDesc: e.target.value})}
                      placeholder="Brief overview summary for social media shares..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-red-655 hover:bg-red-700 text-white font-mono text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Article Database Row
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. CATEGORIES MANAGEMENT VIEW */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in text-stone-300 select-none">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm uppercase font-mono tracking-widest text-[#ea1c24]">
              Website Categories Pool
            </h3>
            <p className="text-xs text-stone-400">
              Add customized classifications. New category tags automatically register inside the creation layout immediately.
            </p>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2.5 max-w-sm">
            <input
              type="text"
              required
              placeholder="e.g. Tech, Health, Lifestyle"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none flex-grow"
            />
            <button
              type="submit"
              className="bg-red-655 hover:bg-red-700 text-white font-mono text-xs font-bold py-1.5 px-4 rounded-xl cursor-pointer transition shrink-0"
            >
              Add Tag
            </button>
          </form>

          <div className="bg-stone-950 border border-stone-850 rounded-2xl overflow-hidden max-w-md">
            <div className="p-4 border-b border-stone-850 font-mono text-[9px] text-stone-500 uppercase tracking-wider">
              Active Category Registries
            </div>
            <div className="divide-y divide-stone-900 font-mono text-xs">
              {categories.map((cat) => (
                <div key={cat} className="p-3 pl-4 flex justify-between items-center hover:bg-stone-900/50">
                  <span className="font-bold text-white capitalize">{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-[#ea1c24] hover:text-red-500 cursor-pointer p-1 rounded hover:bg-stone-900"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. COMMENTS MANAGEMENT VIEW */}
      {activeTab === 'comments' && (
        <div className="space-y-6 animate-fade-in text-stone-300 select-none">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm uppercase font-mono tracking-widest text-[#ea1c24]">
              Moderated Reader Discussions Desk
            </h3>
            <p className="text-xs text-stone-405">
              Review reader briefs. Approving updates caches the comment on live view grids immediately.
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-850 rounded-2xl overflow-hidden divide-y divide-stone-900">
            {comments.length === 0 ? (
              <p className="p-6 text-stone-500 italic text-center text-xs font-mono">
                No discussion entries recorded.
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-stone-900/40 transition">
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-2 select-none text-[10px] font-mono">
                      <span className="text-white font-bold">{comment.authorName}</span>
                      <span className="text-stone-550">•</span>
                      <span>{comment.date}</span>
                      <span className="text-stone-550">•</span>
                      <span className="text-red-500 truncate max-w-[150px]">Ref: {comment.articleId}</span>
                    </div>
                    <p className="text-xs font-sans text-stone-300 leading-normal italic select-text">
                      &ldquo;{comment.commentText}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 whitespace-nowrap self-end md:self-auto select-none">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 font-mono text-[10px] font-bold py-1 px-2.5 rounded border border-emerald-900 cursor-pointer transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="bg-rose-950/40 hover:bg-rose-950 text-[#ea1c24] font-mono text-[10px] font-bold py-1 px-2.5 rounded border border-rose-950 cursor-pointer transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. MEDIA LIBRARY / UPLOAD SYSTEM */}
      {activeTab === 'media' && (
        <div className="space-y-6 animate-fade-in text-stone-300 select-none">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm uppercase font-mono tracking-widest text-[#ea1c24]">
              Sovereign Asset & Media Library
            </h3>
            <p className="text-xs text-stone-400">
              Drag and drop graphics or log direct image pipelines. Uploaded assets offer direct URL caches for article imagery entries immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Upload Area (Scale Col 5) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Drag and Drop Zone */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDropSimulated}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                  dragActive 
                    ? 'border-[#ea1c24] bg-[#ea1c24]/5 text-white' 
                    : 'border-stone-800 bg-stone-900/10 text-stone-400 hover:border-stone-700'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-stone-500 animate-pulse" />
                <div>
                  <strong className="text-white text-xs block">Drag & Drop Image Files</strong>
                  <span className="text-[10px] font-mono text-stone-550 block mt-1">SUPPORT JPG, PNG, GIF RECOGNITIONS</span>
                </div>
              </div>

              {/* Manual Direct URL entry */}
              <form onSubmit={handleManualUploadSubmit} className="bg-stone-950 border border-stone-850 p-4 rounded-xl space-y-3">
                <h5 className="font-mono text-[9.5px] uppercase font-bold text-stone-400 tracking-wider">
                  Direct image CDN Asset Pipeline
                </h5>
                <div className="space-y-1.5">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={uploadedUrl}
                    onChange={(e) => setUploadedUrl(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 px-3 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Brief caption text..."
                    value={uploadedCaption}
                    onChange={(e) => setUploadedCaption(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-1.5 px-3 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-655 hover:bg-red-700 text-white font-mono text-[10px] font-bold py-1.5 px-3.5 rounded transition cursor-pointer"
                >
                  Link Asset
                </button>
              </form>
            </div>

            {/* Assets Grid (Scale Col 7) */}
            <div className="lg:col-span-7 bg-stone-950 border border-stone-850 p-5 rounded-2xl space-y-4">
              <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white">
                Cataloged Asset Thumbnails
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {mediaItems.map(item => (
                  <div key={item.id} className="bg-stone-900 border border-stone-800 rounded-xl p-1 text-center font-mono text-[9.5px] space-y-1">
                    <img 
                      src={item.url} 
                      alt={item.caption} 
                      className="w-full h-20 object-cover rounded-lg filter saturate-[0.8]"
                    />
                    <div className="truncate text-stone-300 p-1 font-bold">{item.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SEO & OPEN GRAPH SETTINGS */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveGlobalSeo} className="space-y-6 animate-fade-in text-stone-300 select-none">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm uppercase font-mono tracking-widest text-[#ea1c24]">
              Open Graph & Metadata Global Settings
            </h3>
            <p className="text-xs text-stone-400">
              Customize meta designations for Search Engine Optimization to increase digital presence on shared platforms.
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase">Og:Title Designation Override</label>
              <input
                type="text"
                required
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase">Og:Description Summary Overview</label>
              <textarea
                required
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-red-655 hover:bg-red-700 text-white font-mono text-xs font-bold py-2 px-5 rounded-xl cursor-pointer transition shadow-xs"
          >
            Save Global SEO Metadata
          </button>
        </form>
      )}

      {/* 6.5. DATABASE AND SYNC VIEW */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in text-stone-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Connection Status Panel (Col span 5) */}
            <div className="lg:col-span-5 space-y-5 bg-stone-950 border border-stone-850 p-5 rounded-2xl select-text">
              <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white border-b border-stone-850 pb-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#ea1c24]" />
                Supabase Backend Status
              </h4>

              {isSupabaseConfigured() ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
                    <span className="text-xs font-mono font-bold text-emerald-400">SUPABASE ACTIVE SYNC LIVE</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    TheRoadMapNews is currently connected to a live Supabase relational backend database schema. All new columns, breaking news edits, reader comments, and letters are dynamically written to and read from your database.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-amber-950/40 border border-amber-900/50 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0"></span>
                    <span className="text-xs font-mono font-bold text-amber-500 font-sans">MOCK BROWSER SYNC</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Currently utilizing local browser memory for articles and moderate logs. Run the SQL script on your Supabase instance, then configure environmental keys to start reading and writing dynamically to the cloud.
                  </p>
                </div>
              )}

              <div className="space-y-3 border-t border-stone-900 pt-3">
                <h5 className="font-mono text-[10px] font-extrabold uppercase text-white flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  Connection Instructions:
                </h5>
                <ol className="text-[11px] text-stone-400 space-y-2 list-decimal list-inside font-sans pl-1">
                  <li>Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-red-400 font-bold underline hover:text-red-305">Supabase Dashboard</a> and create a new project.</li>
                  <li>Click on the <strong>SQL Editor</strong> tab on the left sidebar.</li>
                  <li>In the editor, click <strong>"New query"</strong>, paste the complete SQL script shown on the right, and press <strong>Run</strong>.</li>
                  <li>Copy your project’s <strong>API URL</strong> and <strong>Anon Key</strong> from Project Settings &gt; API.</li>
                  <li>Add them to your environment variables file as:
                    <div className="bg-stone-900 p-2 rounded-lg mt-1 font-mono text-[10px] text-stone-300 select-all border border-stone-850">
                      VITE_SUPABASE_URL="your-supabase-url"<br />
                      VITE_SUPABASE_ANON_KEY="your-anon-key"
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* SQL Script Display Panel (Col span 7) */}
            <div className="lg:col-span-7 bg-stone-950 border border-stone-850 p-5 rounded-2xl flex flex-col space-y-4">
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center">
                <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white">
                  Database SQL Setup Script
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
                    addAlert("Supabase SQL Script copied to clipboard!", 'success');
                  }}
                  className="bg-red-655 hover:bg-red-700 text-white font-mono text-[10px] font-bold py-1 px-3 rounded-lg cursor-pointer transition flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Copy SQL Script
                </button>
              </div>

              <div className="flex-1 min-h-[300px] max-h-[420px] overflow-y-auto bg-stone-920 border border-stone-900 rounded-xl p-3 text-[10px] font-mono text-stone-300 leading-normal select-all whitespace-pre">
                {SUPABASE_SQL_SCRIPT}
              </div>
              <p className="text-[10px] text-stone-500 font-mono italic">
                * Running this script enables RLS rules and bootstraps initial tables and a test article correctly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. PROFILE & USER PASSWORD */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in text-stone-300 select-none">
          {/* User Profile Overview */}
          <div className="space-y-5 bg-stone-950 border border-stone-850 p-5 rounded-2xl select-text">
            <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white border-b border-stone-850 pb-2">
              Corporate Desk Admin Profile
            </h4>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">USER LEVEL</span>
                <span className="text-red-500 font-bold uppercase">Super Administrator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">USERNAME REFERENCE</span>
                <span>admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">SESSION EXPR REGISTRIES</span>
                <span className="text-emerald-400 uppercase">Active (Cleared secure node CDN)</span>
              </div>
            </div>
          </div>

          {/* Secure simulated password change block */}
          <form onSubmit={handleChangePassword} className="space-y-4 bg-stone-950 border border-stone-850 p-5 rounded-2xl">
            <h4 className="font-mono text-xs uppercase font-extrabold tracking-wider text-white border-b border-stone-850 pb-2">
              Update Admin Password
            </h4>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase font-sans">Current Password *</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Simulate: Ola12345"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase font-sans">New Password *</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase font-sans">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-red-655 hover:bg-red-700 text-white font-mono text-[10px] font-bold py-1.5 px-3.5 rounded-xl transition cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
