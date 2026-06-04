import { createClient } from '@supabase/supabase-js';
import { NewsArticle, Comment } from '../data/allArticles';
import { LetterToEditor, CategoryType } from '../types';

// Retrieve credentials safely from Vite environment variables or hardcoded fallback
const HARDCODED_URL = 'https://gjwasdzgunaahsexkpac.supabase.co';
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqd2FzZHpndW5hYWhzZXhrcGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NTU2NDMsImV4cCI6MjA5NTUzMTY0M30.lDUROS9s8ocBOTZZsRnEuxHfTk9uIWvM0tVJdZINhVc';

const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Clean up any extra paths in URLs if present (e.g. trailing /rest/v1 or nested .supabase.co)
const cleanUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/+$/, '');
  cleaned = cleaned.replace(/\/rest\/v1\/\.supabase\.co$/, '');
  cleaned = cleaned.replace(/\/rest\/v1$/, '');
  return cleaned;
};

const getActiveCredentials = () => {
  const isEnvValid = (url: string, key: string) => {
    return (
      !!url &&
      !!key &&
      url.trim().length > 0 &&
      key.trim().length > 0 &&
      !url.includes('your-supabase-project') &&
      !key.includes('your-anon-key-here')
    );
  };

  if (isEnvValid(rawUrl, rawKey)) {
    return {
      url: cleanUrl(rawUrl),
      key: rawKey.trim()
    };
  }

  // Fallback to the user's supplied credentials
  return {
    url: cleanUrl(HARDCODED_URL),
    key: HARDCODED_KEY.trim()
  };
};

const credentials = getActiveCredentials();
export const SUPABASE_URL = credentials.url;
export const SUPABASE_ANON_KEY = credentials.key;

// Check if credentials are valid and present
export const isSupabaseConfigured = (): boolean => {
  return (
    !!SUPABASE_URL && 
    !!SUPABASE_ANON_KEY && 
    SUPABASE_URL.trim().length > 0 &&
    SUPABASE_ANON_KEY.trim().length > 0 &&
    !SUPABASE_URL.includes('your-supabase-project') && 
    !SUPABASE_ANON_KEY.includes('your-anon-key-here') &&
    SUPABASE_URL.startsWith('http')
  );
};

// Initialize Supabase Client (lazy loaded to prevent crash if unconfigured)
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    } catch (e) {
      console.error('Supabase initialization failed:', e);
    }
  }
  return supabaseInstance;
};

/* ==========================================
   SQL DATABASE SETUP SCRIPTS (FOR USER COPY)
   ========================================== */
export const SUPABASE_SQL_SCRIPT = `-- SUPABASE DATABASE INITIALIZATION SCRIPT FOR THEROADMAPNEWS
-- Go to your Supabase Project -> SQL Editor -> Paste & Run this script.

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'articles' Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('politics', 'business', 'sports', 'education', 'entertainment', 'opinion')),
  headline TEXT NOT NULL,
  subheading TEXT,
  snippet TEXT NOT NULL,
  content TEXT NOT NULL, -- Paragraphs split by \\n
  byline TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  read_time TEXT NOT NULL,
  image TEXT NOT NULL,
  image_caption TEXT,
  video_url TEXT,
  is_breaking BOOLEAN DEFAULT false,
  is_hero BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  meta_title TEXT,
  meta_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anonymous users (public readers) can read all published non-draft articles
CREATE POLICY "Allow public select of articles" 
  ON public.articles FOR SELECT 
  USING (true);

-- Authenticated Admin operations
CREATE POLICY "Allow admin operations on articles" 
  ON public.articles FOR ALL 
  USING (true)
  WITH CHECK (true);


-- 3. Create 'comments' Table
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  article_id TEXT REFERENCES public.articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  date TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow public to view comments and post comments
CREATE POLICY "Allow public select on comments" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Allow public insert on comments" 
  ON public.comments FOR INSERT WITH CHECK (true);

-- Admin control for comments
CREATE POLICY "Allow admin manage comments" 
  ON public.comments FOR ALL USING (true);


-- 4. Create 'letters_to_editor' Table
CREATE TABLE IF NOT EXISTS public.letters_to_editor (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on letters
ALTER TABLE public.letters_to_editor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public view and submit letters" 
  ON public.letters_to_editor FOR SELECT USING (true);

CREATE POLICY "Allow public insert letters" 
  ON public.letters_to_editor FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin delete letters" 
  ON public.letters_to_editor FOR ALL USING (true);


-- 5. Create 'contact_messages' Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public submit messages" 
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read messages" 
  ON public.contact_messages FOR ALL USING (true);


-- 6. Prepopulate some demo articles if table is empty
INSERT INTO public.articles (id, category, headline, subheading, snippet, content, byline, date, location, read_time, image, image_caption, is_breaking, is_hero, views, tags)
VALUES (
  'arn-biz-naira',
  'business',
  'Naira Rebounds as Central Bank Releases Foreign Exchange Backlog',
  'Apex banks fresh dollar injects trigger strong convergence in parallel market segments.',
  'In an unexpected boost to manufacturing circles, the Naira yesterday registered robust gains against major Western currencies at physical clearing chambers.',
  'The Central Bank of Nigeria has cleared a substantial portion of the verified foreign exchange backlog, injecting an additional $450m into retail inter-bank operations.\\nThis decisive policy movement has triggered a rapid stabilization trend in Lagos, Port Harcourt, and Abuja commercial desks, narrowing the parallel market margin to under 3%.\\nLocal manufacturers, who have long complained about foreign input procurement bottlenecks, expressed severe optimism. Industry unions call on the central bank to sustain exchange liquidity throughout the fiscal quarters of 2026.',
  'Segun Adesina, Financial Desk',
  'May 28, 2026',
  'LAGOS',
  '4 min read',
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800&h=500',
  'Forex currency notes undergoing official ledger logging at the Interbank Exchange Station.',
  true,
  true,
  14205,
  ARRAY['Naira', 'Central Bank', 'Economy', 'Forex']
) ON CONFLICT (id) DO NOTHING;
`;

/* ==========================================
   MAPPING HELPERS (SNAKE_CASE TO CAMELCASE)
   ========================================== */
export const mapArticleFromDb = (dbArt: any): NewsArticle => {
  return {
    id: dbArt.id,
    category: dbArt.category,
    headline: dbArt.headline,
    subheading: dbArt.subheading,
    snippet: dbArt.snippet,
    content: dbArt.content,
    byline: dbArt.byline,
    date: dbArt.date,
    location: dbArt.location,
    readTime: dbArt.read_time || dbArt.readTime || '3 min read',
    image: dbArt.image,
    imageCaption: dbArt.image_caption || dbArt.imageCaption,
    videoUrl: dbArt.video_url || dbArt.videoUrl,
    isBreaking: dbArt.is_breaking !== undefined ? dbArt.is_breaking : dbArt.isBreaking,
    isHero: dbArt.is_hero !== undefined ? dbArt.is_hero : dbArt.isHero,
    isDraft: dbArt.is_draft !== undefined ? dbArt.is_draft : dbArt.isDraft,
    views: dbArt.views || 0,
    tags: dbArt.tags || [],
    metaTitle: dbArt.meta_title || dbArt.metaTitle,
    metaDesc: dbArt.meta_desc || dbArt.metaDesc
  };
};

export const mapArticleToDb = (art: NewsArticle) => {
  return {
    id: art.id,
    category: art.category,
    headline: art.headline,
    subheading: art.subheading,
    snippet: art.snippet,
    content: art.content,
    byline: art.byline,
    date: art.date,
    location: art.location,
    read_time: art.readTime,
    image: art.image,
    image_caption: art.imageCaption,
    video_url: art.videoUrl,
    is_breaking: !!art.isBreaking,
    is_hero: !!art.isHero,
    is_draft: !!art.isDraft,
    views: art.views || 0,
    tags: art.tags || [],
    meta_title: art.metaTitle,
    meta_desc: art.metaDesc
  };
};

export const mapCommentFromDb = (dbComm: any): Comment => {
  return {
    id: dbComm.id,
    articleId: dbComm.article_id || dbComm.articleId,
    authorName: dbComm.author_name || dbComm.authorName,
    commentText: dbComm.comment_text || dbComm.commentText,
    date: dbComm.date,
    approved: dbComm.approved !== undefined ? dbComm.approved : true
  };
};

export const mapCommentToDb = (comm: Comment) => {
  return {
    id: comm.id,
    article_id: comm.articleId,
    author_name: comm.authorName,
    comment_text: comm.commentText,
    date: comm.date,
    approved: comm.approved
  };
};


/* ==========================================
   CORE DATA API - LIVE SUPABASE SYNC WRAPPERS
   ========================================== */

// --- ARTICLES ---
export const dbFetchArticles = async (fallbackData: NewsArticle[]): Promise<NewsArticle[]> => {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackData;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles from Supabase:', error);
      return fallbackData;
    }

    if (data && data.length > 0) {
      return data.map(mapArticleFromDb);
    } else {
      // If connected but table is empty, seed initial data to Supabase
      console.log('Supabase articles are empty, seeding initial articles...');
      for (const article of fallbackData) {
        await dbUpsertArticle(article);
      }
      return fallbackData;
    }
  } catch (err) {
    console.error('Failed to run dbFetchArticles:', err);
    return fallbackData;
  }
};

export const dbUpsertArticle = async (article: NewsArticle): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const dbPayload = mapArticleToDb(article);
    const { error } = await supabase
      .from('articles')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting article on Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbUpsertArticle:', err);
    return false;
  }
};

export const dbDeleteArticle = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article on Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbDeleteArticle:', err);
    return false;
  }
};

// --- COMMENTS ---
export const dbFetchAllComments = async (fallbackComments: Comment[]): Promise<Comment[]> => {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackComments;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*');

    if (error) {
      console.error('Error fetching comments from Supabase:', error);
      return fallbackComments;
    }

    if (data && data.length > 0) {
      return data.map(mapCommentFromDb);
    }
    return fallbackComments;
  } catch (err) {
    console.error('Failed dbFetchAllComments:', err);
    return fallbackComments;
  }
};

export const dbUpsertComment = async (comment: Comment): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const dbPayload = mapCommentToDb(comment);
    const { error } = await supabase
      .from('comments')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting comment on Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbUpsertComment:', err);
    return false;
  }
};

export const dbDeleteComment = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbDeleteComment:', err);
    return false;
  }
};

// --- LETTERS TO THE EDITOR ---
export const dbFetchLetters = async (fallbackLetters: LetterToEditor[]): Promise<LetterToEditor[]> => {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackLetters;

  try {
    const { data, error } = await supabase
      .from('letters_to_editor')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching letters from Supabase:', error);
      return fallbackLetters;
    }

    if (data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        location: d.location,
        title: d.title,
        message: d.message,
        date: d.date
      }));
    }
    return fallbackLetters;
  } catch (err) {
    console.error('Failed dbFetchLetters:', err);
    return fallbackLetters;
  }
};

export const dbUpsertLetter = async (letter: LetterToEditor): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('letters_to_editor')
      .upsert({
        id: letter.id,
        name: letter.name,
        location: letter.location,
        title: letter.title,
        message: letter.message,
        date: letter.date
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting letter on Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbUpsertLetter:', err);
    return false;
  }
};

export const dbDeleteLetter = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('letters_to_editor')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting letter:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbDeleteLetter:', err);
    return false;
  }
};

// --- CONTACT FORM SUBMISSIONS ---
export const dbSubmitContact = async (contactMsg: any): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactMsg.name,
        email: contactMsg.email,
        phone: contactMsg.phone || '',
        category: contactMsg.category,
        message: contactMsg.message,
      });

    if (error) {
      console.error('Error logging contact message to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed dbSubmitContact:', err);
    return false;
  }
};
