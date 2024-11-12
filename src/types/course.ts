export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  category: 'programming' | 'marketing' | 'design';
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  featured: boolean;
  isNew: boolean;
}