/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart2, FileText, Image, Video, Users, Settings, PlusCircle, Trash2, 
  Layers, ExternalLink, LogOut, CheckCircle2, AlertCircle, Save, Sparkles, Pin
} from 'lucide-react';
import { Article, CategoryType } from '../types';
import ReadingModal from './ReadingModal';

interface WPDashboardProps {
  articles: Article[];
  onUpdateArticles: (updated: Article[]) => void;
  onLogout: () => void;
  onViewNews: () => void;
}

export default function WPDashboard({
  articles,
  onUpdateArticles,
  onLogout,
  onViewNews
}: WPDashboardProps) {
  // Navigation tabs in WP sidebar
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'add' | 'media'>('overview');
  
  // Local state to preview articles in the dashboard
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // New article state fields
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [category, setCategory] = useState<CategoryType>('politics');
  const [location, setLocation] = useState('LAGOS');
  const [byline, setByline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isHero, setIsHero] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [imageCaption, setImageCaption] = useState('');

  // Alerts indicator
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Suggested high quality Unsplash placeholders for easy adding
  const PRESET_IMAGES = [
    { label: 'Nigerian Capital (Abuja)', url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800&h=500' },
    { label: 'Technology Workspace', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800&h=500' },
    { label: 'Sovereign Currency Trade', url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800&h=500' },
    { label: 'Energy Solar farm', url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800&h=500' },
    { label: 'Super Eagles Soccer Pitch', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800&h=500' },
  ];

  const PRESET_VIDEOS = [
    { label: 'Aviation Focus', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { label: 'Macro Economy Update', url: 'https://www.w3schools.com/html/movie.mp4' }
  ];

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const clearForm = () => {
    setHeadline('');
    setSubheading('');
    setCategory('politics');
    setLocation('LAGOS');
    setByline('');
    setImageUrl('');
    setVideoUrl('');
    setBodyText('');
    setIsHero(false);
    setIsBreaking(false);
    setImageCaption('');
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      triggerAlert('error', 'Post Headline is strictly required.');
      return;
    }
    if (!bodyText.trim()) {
      triggerAlert('error', 'Article body coordinates cannot be blank.');
      return;
    }

    // Process paragraph splits from double line break
    const paragraphs = bodyText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const newArticle: Article = {
      id: `custom-post-${Date.now()}`,
      category,
      headline: headline.trim(),
      subheading: subheading.trim() || undefined,
      snippet: paragraphs[0] ? (paragraphs[0].substring(0, 160) + '...') : headline,
      fullContent: paragraphs,
      byline: byline.trim() || 'Staff Reporter',
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      location: location.toUpperCase(),
      readTime: `${Math.max(1, Math.ceil(paragraphs.join(' ').split(' ').length / 180))} min read`,
      image: imageUrl.trim() || undefined,
      imageCaption: imageCaption.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      isBreaking,
      isHero,
      isSubHero: !isHero && imageUrl ? true : false,
      columnSpan: isHero ? 3 : 1
    };

    let updatedArticles = [...articles];

    // If this is set as Hero, clear previous Hero status to avoid layout break
    if (isHero) {
      updatedArticles = updatedArticles.map(art => {
        if (art.isHero) {
          return { ...art, isHero: false, isSubHero: true };
        }
        return art;
      });
    }

    updatedArticles = [newArticle, ...updatedArticles];
    onUpdateArticles(updatedArticles);
    triggerAlert('success', `"${headline}" has been published to the newspaper system successfully!`);
    clearForm();
    setActiveTab('posts');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you absolute sure you want to delete this press column permanently?')) {
      const updated = articles.filter(art => art.id !== id);
      onUpdateArticles(updated);
      triggerAlert('success', 'Article removed from live news database.');
    }
  };

  const handleToggleHero = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        return { ...art, isHero: true, columnSpan: 3 };
      }
      return { ...art, isHero: false, columnSpan: (art.isSubHero || art.image) ? 2 : 1 };
    });
    onUpdateArticles(updated);
    triggerAlert('success', 'Assigned selected article as Hero story of the front-page.');
  };

  return (
    <div className="w-full bg-[#1e1e1e] text-[#f0f0f1] font-sans rounded-md overflow-hidden border border-[#2c2c2d] select-none text-sm shadow-2xl flex flex-col min-h-[680px]">
      
      {/* WordPress Admin Black Header Bar */}
      <div className="bg-[#121212] px-4 py-2.5 flex items-center justify-between border-b border-[#2c2c2d]">
        <div className="flex items-center gap-3">
          <div className="bg-[#ea1c24] text-white p-1 rounded font-black text-xs flex items-center justify-center gap-1">
            <span className="font-serif">W</span>
            <span className="font-sans text-[10px] tracking-tight">CHRONICLE</span>
          </div>
          <span className="text-stone-400 font-mono text-[11px]">|</span>
          <div className="hidden sm:flex items-center gap-2.5 text-xs">
            <span className="text-stone-300 font-bold">THEROADMAPNEWS Engine Workspace</span>
            <span className="bg-stone-800 text-[#72dec2] text-[9.5px] px-1.5 py-0.5 rounded font-mono">
              Live Database Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button 
            onClick={onViewNews}
            className="flex items-center gap-1 px-3 py-1 bg-[#ea1c24] hover:bg-red-700 text-white rounded font-bold cursor-pointer transition shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Launch Live Press
          </button>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Column Grid layout (Black WP Sidebar + Content area) */}
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Left Side WordPress Sidebar */}
        <aside className="w-full md:w-56 bg-[#1d2327] border-r border-[#2c3338] flex flex-col text-stone-300">
          <div className="p-3 bg-[#1d2327] border-b border-[#2c3338] flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#ea1c24] flex items-center justify-center text-[11px] font-black font-serif text-white uppercase shadow">
              P
            </div>
            <div>
              <div className="font-bold text-white text-xs leading-none">Press admin</div>
              <span className="text-[9.5px] text-stone-400 font-mono">editor@daily-chronicle.ng</span>
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition font-medium cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#007cba] text-white'
                  : 'hover:bg-stone-805/70 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-stone-400" />
              <span>WP Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition font-medium cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#007cba] text-white'
                  : 'hover:bg-stone-805/70 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-stone-400" />
              <span>All News Posts ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition font-medium cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-[#007cba] text-white'
                  : 'hover:bg-stone-850/70 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-stone-400" />
              <span className="font-bold">Add New Article</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition font-medium cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#007cba] text-white'
                  : 'hover:bg-stone-850/70 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4 text-stone-400" />
              <span>Media & Video Gallery</span>
            </button>

            <div className="pt-4 pb-2 px-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">System Links</span>
            </div>

            <div className="text-[11px] px-3 py-2 space-y-2 text-stone-400 leading-normal bg-stone-900/40 rounded-sm border border-stone-800">
              <div>System Engine: <strong className="text-emerald-400 font-mono">WP-5.8.3</strong></div>
              <div>Database: <strong className="text-cyan-400 font-mono">React LocalState</strong></div>
              <div>Active Theme: <strong className="text-amber-400 font-mono">Roadmap Standard</strong></div>
            </div>
          </nav>
        </aside>

        {/* Right workspace panel */}
        <main className="flex-1 p-4 md:p-6 bg-[#f0f0f1] text-[#2c3338] overflow-y-auto max-h-[85vh]">
          
          {/* Notifications banner */}
          {alertMsg && (
            <div className={`mb-4 p-3 rounded shadow-sm flex items-start gap-2 border-l-4 ${
              alertMsg.type === 'success' 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                : 'bg-red-50 border-red-500 text-red-900'
            }`}>
              {alertMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span className="font-mono text-xs">{alertMsg.text}</span>
            </div>
          )}

          {/* TAB CONTENT: WP OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900">Dashboard</h1>
                <p className="text-xs text-stone-500">Welcome to your Nigerian Daily Chronicle administrative press center.</p>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-4 rounded border border-stone-250 shadow-xs">
                  <div className="text-xs font-mono uppercase font-bold text-stone-400">Total Articles</div>
                  <div className="text-3xl font-serif font-black text-stone-900 mt-2">{articles.length}</div>
                  <span className="text-[10px] text-emerald-600 block mt-1">● 100% indexed in memory</span>
                </div>

                <div className="bg-white p-4 rounded border border-stone-250 shadow-xs">
                  <div className="text-xs font-mono uppercase font-bold text-stone-400">Breaking Alerts</div>
                  <div className="text-3xl font-serif font-black text-stone-900 mt-2">
                    {articles.filter(a => a.isBreaking).length}
                  </div>
                  <span className="text-[10px] text-red-600 block mt-1">🔥 Top page ticker alerts</span>
                </div>

                <div className="bg-white p-4 rounded border border-stone-250 shadow-xs">
                  <div className="text-xs font-mono uppercase font-bold text-stone-400">Featured Media</div>
                  <div className="text-3xl font-serif font-black text-stone-900 mt-2">
                    {articles.filter(a => a.image || a.videoUrl).length}
                  </div>
                  <span className="text-[10px] text-blue-600 block mt-1">📸 Video streams or Photos active</span>
                </div>

                <div className="bg-white p-4 rounded border border-stone-250 shadow-xs bg-red-50/50 border-red-200">
                  <div className="text-xs font-mono uppercase font-bold text-red-550">Hero Story</div>
                  <div className="text-xs font-medium text-stone-800 mt-2 italic truncate max-w-[200px]">
                    {articles.find(a => a.isHero)?.headline || "None assigned"}
                  </div>
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className="text-[10px] text-[#ea1c24] font-bold hover:underline block mt-1 uppercase"
                  >
                    Change Cover story →
                  </button>
                </div>

              </div>

              {/* WP Welcoming Box */}
              <div className="bg-white p-6 rounded border border-stone-250 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h3 className="font-serif font-black text-base text-stone-900">
                    At a Glance: THEROADMAPNEWS Digital Pressroom
                  </h3>
                </div>
                
                <p className="text-stone-650 leading-relaxed text-xs">
                  Use this customized site panel to simulate standard, fast newsroom publishing flows. Adding a post here instantly injects the article, correct parameters, visual references, and optional videos directly into the front-page brodsheet grid with custom calculations.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2 select-none">
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-[#007cba] hover:bg-blue-700 text-white font-mono text-xs font-bold py-2 px-4 rounded transition cursor-pointer"
                  >
                    Create Post Channel
                  </button>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-mono text-xs py-2 px-4 rounded transition cursor-pointer"
                  >
                    Manage Existing Columns
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: MANAGE POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900">All Live Newspaper Posts</h1>
                  <p className="text-xs text-stone-500">Edit, assign top priorities, or delete front-page files directly.</p>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-[#007cba] hover:bg-blue-700 text-white text-xs font-mono font-bold py-1.5 px-3 rounded transition cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add New
                </button>
              </div>

              {/* Table of active posts */}
              <div className="bg-white rounded border border-stone-250 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-250 text-[10.5px] font-mono text-stone-600 uppercase font-black">
                      <th className="p-3">Title Details</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Byline/Date</th>
                      <th className="p-3">Attributes</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50/70">
                        <td className="p-3">
                          <div className="font-serif font-black text-[13.5px] text-stone-900">
                            {art.headline}
                          </div>
                          {art.subheading && (
                            <div className="text-stone-500 text-[11px] italic truncate max-w-sm mt-0.5">
                              {art.subheading}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] text-stone-400">
                            <span>ID: {art.id}</span>
                            <span>|</span>
                            <span>Loc: <strong>{art.location}</strong></span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-stone-100 text-stone-800 border border-stone-250 font-mono font-bold uppercase text-[9.5px] px-2 py-0.5 rounded-sm">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-stone-800">{art.byline}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{art.date}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {art.isHero && (
                              <span className="bg-red-100 text-red-800 border border-red-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-sm flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5" /> HERO
                              </span>
                            )}
                            {art.isBreaking && (
                              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-sm">
                                BREAKING
                              </span>
                            )}
                            {art.videoUrl && (
                              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-sm">
                                VIDEO STREAM
                              </span>
                            )}
                            {!art.isHero && !art.isBreaking && !art.videoUrl && (
                              <span className="text-stone-400 text-[10px] italic">Standard col</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {!art.isHero && (
                              <button
                                onClick={() => handleToggleHero(art.id)}
                                className="text-[10px] font-mono font-bold uppercase text-[#007cba] hover:underline cursor-pointer"
                                title="Set as main cover Hero story"
                              >
                                Set Cover Hero
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePost(art.id)}
                              className="text-red-700 hover:bg-red-50 p-1.5 rounded transition cursor-pointer"
                              title="Delete Post permanently"
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
          )}

          {/* TAB CONTENT: ADD NEW ARTICLE FORM */}
          {activeTab === 'add' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900">Add New Post Channel</h1>
                <p className="text-xs text-stone-500">Inject dynamic breaking, custom video, or featured reports onto active paper.</p>
              </div>

              <form onSubmit={handleAddPost} className="bg-white rounded border border-stone-250 p-6 shadow-xs space-y-4">
                
                {/* Headline input */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                    Post Headline / Title (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FG Directs Local Refining of Crude Oil from Nigerian Joint-Venture Grids"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Subheading / Deck */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                    Subheading / Abstract (Decisive brief)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Landmark policy to reduce offshore shipment logistics costs by 45% starting next industrial quarter."
                    value={subheading}
                    onChange={(e) => setSubheading(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Categories & State metadata tag */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Newspaper Section Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm text-stone-900"
                    >
                      <option value="politics">Politics (Federal Admin)</option>
                      <option value="business">Business (Local Finance)</option>
                      <option value="sports">Sports (Super Eagles, Athletics)</option>
                      <option value="education">Education (University reforms)</option>
                      <option value="entertainment">Entertainment (Nollywood/Arts)</option>
                      <option value="opinion">Opinion Editorial (Commentary)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Filing Dateline / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LAGOS, ABUJA, ENUGU, KANO"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm uppercase text-stone-900 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Author Attribution Byline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tunde Alabi, Senior Correspondent"
                      value={byline}
                      onChange={(e) => setByline(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm text-stone-900"
                    />
                  </div>

                </div>

                {/* Cover Image URL Setup with Preset Buttons */}
                <div className="space-y-2 border border-stone-200 p-3 bg-stone-50 rounded-sm">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Featured Graphic Cover Image Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Cover Image Photo Caption
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Delegates discussing sovereign currency options under the new Lagos technology grant."
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900"
                    />
                  </div>

                  {/* Preset Quick Loader Buttons */}
                  <div className="space-y-1 pt-1.5">
                    <label className="block text-[10px] font-mono font-bold uppercase text-stone-400">
                      Or select a high fidelity Unsplash Nigerian themed preset placeholder:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(img.url);
                            setImageCaption(`Archive scene representing: ${img.label}`);
                          }}
                          className="bg-white hover:bg-stone-200 text-stone-800 text-[10px] font-mono font-bold border border-stone-300 px-2 py-1 rounded cursor-pointer transition select-none"
                        >
                          + {img.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Support URL Setup */}
                <div className="space-y-2 border border-stone-200 p-3 bg-stone-50 rounded-sm">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Featured Mp4 Video URL (Optional — adds real HTML5 player on front page)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none"
                    />
                  </div>

                  {/* Preset Video Button Selection */}
                  <div className="space-y-1 pt-1">
                    <label className="block text-[10px] font-mono font-bold uppercase text-stone-400">
                      Or select a light preset video file for quick testing:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_VIDEOS.map((vid, ix) => (
                        <button
                          key={ix}
                          type="button"
                          onClick={() => setVideoUrl(vid.url)}
                          className="bg-white hover:bg-stone-200 text-stone-800 text-[10px] font-mono font-bold border border-stone-300 px-3 py-1 rounded cursor-pointer transition"
                        >
                          🎬 Use {vid.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout Focus Priorities (Breaking news or Hero Story checkbox) */}
                <div className="flex flex-wrap items-center gap-6 bg-[#faf7ee] p-3 rounded border border-amber-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hero-cb"
                      checked={isHero}
                      onChange={(e) => setIsHero(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="hero-cb" className="text-xs font-mono font-black text-stone-950 uppercase cursor-pointer select-none">
                      📌 Set as Main Page Hero story (Overwrites previous Hero story)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="breaking-cb"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="breaking-cb" className="text-xs font-mono font-black text-amber-900 uppercase cursor-pointer select-none">
                      ⚡ Set as Ticker Breaking Alert
                    </label>
                  </div>
                </div>

                {/* Main Article markdown/body copy */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-605">
                      Full Article Body Copy (Required)
                    </label>
                    <span className="text-[10px] font-mono text-stone-400">
                      Tip: Press [Enter] twice to construct a clean new paragraph.
                    </span>
                  </div>
                  <textarea
                    required
                    placeholder="Sir, start composing paragraph content here...&#10;&#10;Second paragraph following closely behind to populate clean multi-column layouts."
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-serif"
                    rows={8}
                  />
                </div>

                {/* Custom Action buttons inside WordPress writer */}
                <div className="flex justify-between items-center pt-2 select-none border-t border-stone-200">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-stone-500 hover:text-stone-800 text-xs font-sans font-medium transition cursor-pointer"
                  >
                    Clear All Fields
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts')}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-mono text-xs font-bold py-2 px-4 rounded transition cursor-pointer"
                    >
                      Back to Posts list
                    </button>
                    
                    <button
                      type="submit"
                      className="bg-[#ea1c24] hover:bg-red-700 text-white font-mono text-xs font-black py-2.5 px-6 rounded transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Publish Article to Broad-Sheet
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* TAB CONTENT: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900">Featured Media and Video streams</h1>
                <p className="text-xs text-stone-500">Preview live videos and photographic coverage indexed on the paper records.</p>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                
                {articles.filter(a => a.image || a.videoUrl).map((art, idx) => (
                  <div key={idx} className="bg-white rounded border border-stone-250 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 border-b border-stone-150 pb-1.5 select-none">
                      <span className="uppercase text-red-700 font-black">{art.category}</span>
                      <span>{art.location}</span>
                    </div>

                    <h5 className="font-serif font-black text-xs text-stone-950 truncate" title={art.headline}>
                      {art.headline}
                    </h5>

                    {/* Media Render */}
                    {art.videoUrl ? (
                      <div className="relative group overflow-hidden border border-stone-300 rounded bg-stone-950">
                        <video 
                          src={art.videoUrl} 
                          controls 
                          className="w-full h-[140px] object-cover"
                          preload="none"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-blue-700 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                          VIDEO TRANSCRIPTION ACTIVE
                        </div>
                      </div>
                    ) : (
                      art.image && (
                        <div className="border border-stone-300 rounded overflow-hidden">
                          <img 
                            src={art.image} 
                            alt="Media item" 
                            className="w-full h-[140px] object-cover filter contrast-[1.05]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )
                    )}

                    <p className="text-[11px] text-stone-550 italic truncate">
                      {art.imageCaption || art.subheading || "System press release file."}
                    </p>

                    <div className="flex justify-between items-center text-[10px] select-none pt-1">
                      <span className="font-mono text-[9px] text-[#007cba] font-bold">Plate Ref: WP-{art.id.substring(0, 8)}</span>
                      <button
                        onClick={() => {
                          setSelectedArticle(art);
                        }}
                        className="text-red-700 font-mono font-black uppercase hover:underline cursor-pointer"
                      >
                        Deep View →
                      </button>
                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

        </main>

      </div>

      {selectedArticle && (
        <ReadingModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          fontSizeClass="base"
          onBookmarkToggle={() => {}}
          isBookmarked={false}
        />
      )}

    </div>
  );
}
