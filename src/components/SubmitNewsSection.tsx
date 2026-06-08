import React, { useState } from 'react';
import { 
  Send, FileText, CheckCircle, Clock, MapPin, User, Image as ImageIcon, AlertCircle, ChevronRight, HelpCircle, UploadCloud, Shield, Check
} from 'lucide-react';
import { NewsArticle } from '../data/allArticles';

interface SubmitNewsSectionProps {
  articles: NewsArticle[];
  onAddSubmittedArticle: (newArticle: NewsArticle) => void;
  isLoggedIn?: boolean;
  onUpdateArticles?: (updatedArticles: NewsArticle[]) => void;
}

// Highly stylized thematic placeholder images matching categories
const CATEGORY_IMAGES = [
  {
    name: "Lagos Urban skyline",
    url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
    category: "politics"
  },
  {
    name: "Central Business Towers",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    category: "business"
  },
  {
    name: "African Football Arena",
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    name: "University Lecture Amphitheater",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    category: "education"
  },
  {
    name: "Creative Stage Spotlights",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    category: "entertainment"
  }
];

export default function SubmitNewsSection({ 
  articles, 
  onAddSubmittedArticle,
  isLoggedIn = false,
  onUpdateArticles
}: SubmitNewsSectionProps) {
  const [formData, setFormData] = useState({
    category: 'politics' as 'politics' | 'business' | 'sports' | 'education' | 'entertainment',
    headline: '',
    subheading: '',
    snippet: '',
    content: '',
    byline: '',
    location: '',
    imageOption: 'preset' as 'preset' | 'custom' | 'upload',
    customImageUrl: '',
    selectedPresetIdx: 0,
    imageCaption: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Track submitted IDs locally to display individual status on this device
  const [locallySubmittedIds, setLocallySubmittedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arn-my-submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApproveArticle = (articleId: string) => {
    if (!onUpdateArticles) return;
    const updated = articles.map(art => {
      if (art.id === articleId) {
        return { ...art, isDraft: false };
      }
      return art;
    });
    onUpdateArticles(updated);
    setSuccessMessage(`Success: Article Approved and Published!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handlePresetSelect = (idx: number) => {
    setFormData(prev => ({ ...prev, selectedPresetIdx: idx }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.headline.trim()) {
      setErrorMessage('Headline is required');
      return;
    }
    if (!formData.snippet.trim()) {
      setErrorMessage('A short snippet summarizer is required');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMessage('Main article content body is required');
      return;
    }
    if (!formData.byline.trim()) {
      setErrorMessage('Author / Correspondent name (Byline) is required');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Reporting location is required');
      return;
    }

    setSubmitStatus('submitting');

    setTimeout(() => {
      try {
        const submissionId = `user-sub-${Date.now()}`;
        
        let finalImageUrl = CATEGORY_IMAGES[formData.selectedPresetIdx].url;
        if ((formData.imageOption === 'custom' || formData.imageOption === 'upload') && formData.customImageUrl.trim()) {
          finalImageUrl = formData.customImageUrl.trim();
        } else {
          // If preset is of another category, pick matching preset index
          const matchingPreset = CATEGORY_IMAGES.find(img => img.category === formData.category);
          if (matchingPreset) {
            finalImageUrl = matchingPreset.url;
          }
        }

        const newArticle: NewsArticle = {
          id: submissionId,
          category: formData.category,
          headline: formData.headline.trim(),
          subheading: formData.subheading.trim() || undefined,
          snippet: formData.snippet.trim(),
          content: formData.content.trim(),
          byline: `${formData.byline.trim()} (Community Contributor)`,
          date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
          location: formData.location.trim(),
          readTime: `${Math.max(1, Math.ceil(formData.content.trim().split(/\s+/).length / 200))} min read`,
          image: finalImageUrl,
          imageCaption: formData.imageCaption.trim() || `Submitted photo by ${formData.byline.trim()}`,
          isDraft: true, // Awaiting admin review to approve
          views: 0
        };

        onAddSubmittedArticle(newArticle);

        // Update tracking logs
        const updatedIds = [...locallySubmittedIds, submissionId];
        setLocallySubmittedIds(updatedIds);
        localStorage.setItem('arn-my-submissions', JSON.stringify(updatedIds));

        setSubmitStatus('success');
        // Reset inputs
        setFormData({
          category: 'politics',
          headline: '',
          subheading: '',
          snippet: '',
          content: '',
          byline: '',
          location: '',
          imageOption: 'preset',
          customImageUrl: '',
          selectedPresetIdx: 0,
          imageCaption: ''
        });

        setTimeout(() => setSubmitStatus('idle'), 8000);
      } catch (err) {
        setSubmitStatus('error');
        setErrorMessage('Failed to submit. Please check parameters.');
      }
    }, 1500);
  };

  // Find corresponding records from the live article store to confirm approval
  const mySubmissionsList = articles.filter(a => locallySubmittedIds.includes(a.id));
  const allPendingDrafts = isLoggedIn ? articles.filter(a => a.isDraft === true) : [];

  return (
    <div className="space-y-10 font-sans max-w-5xl mx-auto">
      {/* Page Title & Heading info card */}
      <div className="border-b border-stone-200 pb-5 select-none">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight uppercase">
          Citizen News Submission
        </h2>
        <p className="text-xs text-stone-550 font-mono mt-1">
          File community briefs, local developments, and grassroots columns. Submissions undergo review by senior staff editors prior to publishing.
        </p>
      </div>

      {isLoggedIn && (
        <div className="bg-emerald-950 text-emerald-300 px-4 py-3.5 rounded-xl border border-emerald-800/60 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold font-mono text-emerald-100 uppercase block tracking-wider mb-0.5">👑 ADMIN CONSOLE ACTIVE</span>
              You are signed in as an administrator. You can approve citizen submissions instantly using the buttons alongside draft items.
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-200 flex items-center gap-2 font-mono text-xs font-bold animate-fade-in shadow-sm">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex gap-3 text-xs text-stone-750">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="space-y-1">
          <strong className="text-stone-900 block font-bold font-mono uppercase tracking-wide">How does the Editorial Go-Ahead work?</strong>
          <p className="leading-relaxed">
            Every submission is loaded securely into the database as a draft. 
            Once you submit below, go to the <span className="font-bold underline text-[#E31B23]">WP Dashboard</span> and log in as staff. Under <strong>Article Management</strong>, drafts are labeled as <span className="bg-stone-800 text-stone-400 text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase">draft</span>. Staff editors can toggle approval status, publishing your story live across home and categorized corridors!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Module Column */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-655" /> Create a Dispatch Draft
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['politics', 'business', 'sports', 'education', 'entertainment'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    className={`py-2 px-1 text-[11px] font-mono font-bold rounded-xl border capitalize cursor-pointer transition select-none text-center ${
                      formData.category === cat
                        ? 'border-red-655 bg-red-50 text-[#E31B23] shadow-xs'
                        : 'border-stone-205 bg-stone-50 hover:bg-stone-100/70 text-stone-650'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline fields */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Headline / Main Title *</label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={e => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="e.g. Community Cooperatives Launch Solar Projects in Shagamu"
                className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400 font-bold"
              />
            </div>

            {/* Subheading (optional) */}
            <div className="space-y-1.5 font-sans">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Subheading (Optional)</label>
              <input
                type="text"
                value={formData.subheading}
                onChange={e => setFormData(prev => ({ ...prev, subheading: e.target.value }))}
                placeholder="e.g. Over fifty smallhold kiosks benefit from localized distribution loops."
                className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-450 italic"
              />
            </div>

            {/* Geographic & Byline details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-stone-455" /> Correspondent Name (Byline) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.byline}
                  onChange={e => setFormData(prev => ({ ...prev, byline: e.target.value }))}
                  placeholder="e.g. Adebayo Alabi"
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-455" /> Report Source Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Ogun State Bureau"
                  className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Snippet / Brief summary */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Short Snippet / Brief *</label>
              <input
                type="text"
                required
                value={formData.snippet}
                onChange={e => setFormData(prev => ({ ...prev, snippet: e.target.value }))}
                placeholder="A high-level single-sentence brief introduction to capture reader interest."
                className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2 px-3 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400"
              />
            </div>

            {/* Column Full Content Body */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase">Article Body Content *</label>
              <textarea
                required
                rows={7}
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write the detailed factual report. Use double breaks to structure separate paragraphs correctly."
                className="w-full bg-stone-50 border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none text-stone-950 placeholder:text-stone-400 font-serif leading-relaxed"
              />
            </div>

            {/* Hero image selector node */}
            <div className="space-y-3 bg-stone-50 p-4 border border-stone-200 rounded-xl">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2 select-none">
                <label className="block text-[10px] font-mono font-bold text-stone-700 uppercase flex items-center gap-1">
                  <ImageIcon className="w-4.5 h-4.5 text-stone-500" /> Hero Photo Attachment Source
                </label>
                <div className="flex gap-2.5 text-[10px] font-mono">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="imageOption"
                      checked={formData.imageOption === 'preset'}
                      onChange={() => setFormData(prev => ({ ...prev, imageOption: 'preset', customImageUrl: '' }))}
                    /> Preset
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="imageOption"
                      checked={formData.imageOption === 'custom'}
                      onChange={() => setFormData(prev => ({ ...prev, imageOption: 'custom', customImageUrl: '' }))}
                    /> Web URL
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="imageOption"
                      checked={formData.imageOption === 'upload'}
                      onChange={() => setFormData(prev => ({ ...prev, imageOption: 'upload', customImageUrl: '' }))}
                    /> Local Upload
                  </label>
                </div>
              </div>

              {formData.imageOption === 'preset' && (
                <div className="space-y-2">
                  <p className="text-[10px] text-stone-500 font-mono">
                    Based on your selected category, we will automatically set a high-fidelity Nigerian photo. Or select a custom image below.
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {CATEGORY_IMAGES.map((img, index) => (
                      <div 
                        key={img.name} 
                        onClick={() => handlePresetSelect(index)}
                        className={`relative rounded overflow-hidden aspect-video border cursor-pointer group ${
                          formData.selectedPresetIdx === index ? 'border-red-655 ring-2 ring-red-500/20' : 'border-stone-200'
                        }`}
                        title={img.name}
                      >
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-155" 
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <span className="text-[7.5px] font-mono text-white bg-black/60 px-1 py-0.2 rounded capitalize">{img.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.imageOption === 'custom' && (
                <div className="space-y-2 font-mono">
                  <input
                    type="url"
                    value={formData.customImageUrl}
                    onChange={e => setFormData(prev => ({ ...prev, customImageUrl: e.target.value }))}
                    placeholder="e.g. https://images.unsplash.com/photo-1546519638-68e109498ffc"
                    className="w-full bg-white border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                  />
                  <p className="text-[9.5px] text-stone-500 font-mono">
                    Must be a clean, direct web path (e.g., Unsplash asset code).
                  </p>
                </div>
              )}

              {formData.imageOption === 'upload' && (
                <div className="space-y-2 font-sans">
                  <div className="relative border-2 border-dashed border-stone-250 hover:border-red-500 transition rounded-xl p-4 bg-white flex flex-col items-center justify-center cursor-pointer text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, customImageUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-7 h-7 text-stone-400 group-hover:text-red-555 transition mb-1" />
                    <span className="text-xs font-bold text-stone-880 block">Select Image from Device</span>
                    <span className="text-[10px] text-stone-450 font-mono">JPEG, PNG, WebP up to 4MB</span>
                  </div>

                  {formData.customImageUrl && (
                    <div className="p-2 border border-stone-200 rounded-xl bg-stone-100/50 flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-stone-200 shrink-0 border border-stone-300">
                        <img 
                          src={formData.customImageUrl} 
                          alt="Local attachment preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="text-xs font-mono overflow-hidden">
                        <p className="font-bold text-stone-850 truncate">image_uploaded_locally.png</p>
                        <p className="text-[9.5px] text-emerald-600 font-bold uppercase tracking-wide">Ready for Draft Dispatch</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <input
                  type="text"
                  value={formData.imageCaption}
                  onChange={e => setFormData(prev => ({ ...prev, imageCaption: e.target.value }))}
                  placeholder="Photo caption (e.g. Shagamu Solar kiosks setup under morning light)"
                  className="w-full bg-white border border-stone-200 focus:ring-1 focus:ring-stone-900 rounded-xl py-1.5 px-3 text-[11px] focus:outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Actions & Alerts */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-750 rounded-xl text-xs font-mono select-none flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="bg-stone-900 hover:bg-black text-white font-mono text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition shadow-sm w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitStatus === 'submitting' ? 'Submitting Story...' : 'Submit Story to Editors'}
            </button>

            {submitStatus === 'success' && (
              <div className="p-3 bg-emerald-850/5 border border-emerald-500/10 text-emerald-700 rounded-xl text-xs font-mono select-none flex items-center gap-1.5 animate-fade-in">
                <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-555" />
                <span>Your article submitted successfully! It is now loaded as a DRAFT. STAFF can activate it or approve it within the WP Admin Dashboard!</span>
              </div>
            )}
          </form>
        </div>

        {/* Status Tracker and Submission Info Column (Scale Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {isLoggedIn && (
            <div className="border border-emerald-500/20 rounded-2xl p-5 bg-emerald-50/15 space-y-4 shadow-sm animate-fade-in">
              <h4 className="font-mono text-xs uppercase font-extrabold tracking-widest text-[#10b981] border-b border-emerald-500/10 pb-2 select-none flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                All Pending Drafts Pool ({allPendingDrafts.length})
              </h4>

              {allPendingDrafts.length > 0 ? (
                <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
                  {allPendingDrafts.map(art => (
                    <div 
                      key={art.id} 
                      className="p-3 bg-white border border-emerald-200/60 rounded-xl space-y-2 text-xs shadow-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-[9px] bg-emerald-100 border border-emerald-200/40 text-emerald-800 px-1.5 py-0.2 rounded uppercase font-bold tracking-wide">
                          {art.category}
                        </span>
                        <div className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-805 border border-amber-200/40 flex items-center gap-1 select-none shrink-0 animate-pulse">
                          <Clock className="w-2.5 h-2.5" /> Awaiting Review
                        </div>
                      </div>

                      <h5 className="font-semibold text-stone-900 leading-snug">
                        {art.headline}
                      </h5>

                      <p className="text-[10px] text-stone-550 leading-normal italic line-clamp-2">
                        {art.snippet}
                      </p>

                      <div className="pt-1.5 select-none flex flex-wrap gap-x-2 text-[9px] font-mono text-stone-450 border-t border-stone-100">
                        <span>By: {art.byline}</span>
                        <span>|</span>
                        <span>{art.location}</span>
                      </div>

                      <button
                        onClick={() => handleApproveArticle(art.id)}
                        className="w-full mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve & Publish
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-emerald-200 rounded-xl text-center font-mono text-xs text-emerald-600 select-none bg-emerald-50/5">
                  <CheckCircle className="w-8 h-8 text-emerald-500/70 mx-auto mb-1 animate-bounce" />
                  <p className="font-bold text-emerald-800">Queue Cleared!</p>
                  <p className="text-[10px] text-stone-450">All draft submissions are approved & active.</p>
                </div>
              )}
            </div>
          )}

          <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50/50 space-y-4">
            <h4 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-505 border-b border-stone-200 pb-2 select-none">
              Your Submissions Hub
            </h4>

            {mySubmissionsList.length > 0 ? (
              <div className="space-y-4 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
                {mySubmissionsList.map(art => {
                  const statusLabel = art.isDraft ? "Awaiting Review" : "Published & Live";
                  return (
                    <div 
                      key={art.id} 
                      className="p-3 bg-white border border-stone-200 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-[9px] bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded uppercase text-stone-550 shrink-0">
                          {art.category}
                        </span>
                        <div className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 select-none shrink-0 ${
                          art.isDraft 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200/50' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200/50'
                        }`}>
                          {art.isDraft ? <Clock className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
                          {statusLabel}
                        </div>
                      </div>

                      <h5 className="font-semibold text-stone-900 leading-snug line-clamp-2">
                        {art.headline}
                      </h5>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono text-[9px] text-stone-450">
                        <span>{art.date}</span>
                        <span>Views: {art.views}</span>
                      </div>

                      {isLoggedIn && art.isDraft && (
                        <button
                          onClick={() => handleApproveArticle(art.id)}
                          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          Approve & Publish
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-stone-204 rounded-xl text-center font-mono text-xs text-stone-400 select-none space-y-1">
                <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                <p>No dispatches found on this device.</p>
                <p className="text-[10px] text-stone-305">Fired dispatches automatically appear here.</p>
              </div>
            )}
          </div>

          {/* Secure Contribution terms card */}
          <div className="border border-stone-205 rounded-2xl p-5 bg-white space-y-3.5 text-xs text-stone-650 leading-relaxed">
            <h4 className="font-mono text-[10px] uppercase font-black text-stone-900 tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-stone-150 select-none">
              Contribution Safety Clauses
            </h4>
            <ul className="space-y-2 list-disc pl-4 font-sans text-[11px]">
              <li>All claims must contain verifiable physical locations and bylines.</li>
              <li>Fake announcements, promotional marketing material, or unauthorized gossip columns are strictly rejected.</li>
              <li>Content editing rights remain with senior editorial desk operators.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
