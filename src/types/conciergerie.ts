export interface Conciergerie {
  id: number;
  name: string;
  slug: string;
  city: string;
  rating: number;
  reviews: number;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string;
  logo: string;
  services: string[];
  platforms: string[];
  commission?: string;
  loyer_garanti?: boolean;
  listingPlan?: 'standard' | 'premium';
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  imageAlt?: string;
  tags: string[];
}
