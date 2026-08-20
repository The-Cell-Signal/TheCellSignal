export type Category = 'Partnerships' | 'Research' | 'Sustainability' | 'Company';

export const CATEGORIES: Category[] = ['Partnerships', 'Research', 'Sustainability', 'Company'];

export interface Story {
  id: string;
  slug: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  published_at: string;
  image_url: string | null;
  body: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoryInput {
  title: string;
  dek: string;
  category: string;
  author: string;
  published_at: string;
  image_url: string | null;
  body: string;
  featured: boolean;
}
