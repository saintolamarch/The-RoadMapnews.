/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'politics' | 'business' | 'sports' | 'education' | 'entertainment' | 'opinion';

export interface Article {
  id: string;
  category: CategoryType;
  headline: string;
  subheading?: string;
  snippet: string;
  fullContent: string[];
  byline: string;
  date: string;
  location: string;
  readTime: string;
  image?: string;
  imageCaption?: string;
  videoUrl?: string; // Optional YouTube ID or Video embed link
  isBreaking?: boolean;
  isHero?: boolean;
  isSubHero?: boolean;
  columnSpan?: number; // 1 to 3
}

export interface LetterToEditor {
  id: string;
  name: string;
  location: string;
  title: string;
  message: string;
  date: string;
}
