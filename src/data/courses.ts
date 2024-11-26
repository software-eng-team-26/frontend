import { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Development',
    description: 'Master modern React with hooks, context, and advanced patterns. Learn to build scalable applications, implement complex state management, and optimize performance through practical projects.',
    price: 99.99,
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    category: 'programming',
    level: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    featured: true,
    isNew: false,
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and experience design. Master user research, wireframing, prototyping, and design systems while building a professional portfolio.',
    price: 79.99,
    instructor: 'Michael Chen',
    duration: '10 hours',
    category: 'design',
    level: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
    featured: true,
    isNew: true,
  },
  {
    id: '3',
    title: 'Digital Marketing Mastery',
    description: 'Comprehensive guide to modern digital marketing strategies. Cover SEO, social media marketing, content strategy, and analytics to drive business growth.',
    price: 89.99,
    instructor: 'Emma Davis',
    duration: '15 hours',
    category: 'marketing',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    featured: true,
    isNew: false,
  },
  {
    id: '4',
    title: 'Full-Stack JavaScript Development',
    description: 'Build modern web applications from front to back. Master Node.js, Express, MongoDB, and deployment while creating real-world projects.',
    price: 129.99,
    instructor: 'David Wilson',
    duration: '20 hours',
    category: 'programming',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60',
    featured: false,
    isNew: true,
  },
  {
    id: '5',
    title: 'Motion Graphics & Animation',
    description: 'Create stunning motion graphics and animations for digital media. Learn industry-standard tools and techniques used by professionals.',
    price: 94.99,
    instructor: 'Lisa Zhang',
    duration: '14 hours',
    category: 'design',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=800&auto=format&fit=crop&q=60',
    featured: false,
    isNew: false,
  }
];

export const featuredCourses = courses.filter(course => course.featured);
export const newCourses = courses.filter(course => course.isNew);