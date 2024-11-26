import { Code2, Palette, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Programming',
    icon: Code2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    categoryId: 2,
    path: '/categories/programming'
  },
  {
    name: 'Design',
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    categoryId: 3,
    path: '/categories/design'
  },
  {
    name: 'Marketing',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    categoryId: 4,
    path: '/categories/marketing'
  },
];

export function CategoryNav() {
  return (
    <div className="flex justify-center space-x-6 py-8">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.name}
            to={category.path}
            className="group flex flex-col items-center"
          >
            <div
              className={cn(
                'p-4 rounded-lg transition-colors group-hover:bg-opacity-80',
                category.bgColor
              )}
            >
              <Icon className={cn('h-6 w-6', category.color)} />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}