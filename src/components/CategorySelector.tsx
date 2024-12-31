import React from 'react';
import { useCategories } from '@natural/context/CategoryContext';
import { HiChevronDown } from 'react-icons/hi2';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategorySelectorProps {
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onChange,
  className = '',
}: CategorySelectorProps) => {
  const { state: { categories }, getCategoryById } = useCategories();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Default category
  const defaultCategory = {
    id: 'default',
    name: 'Default',
    color: '#6B7280', // Gray-500
    icon: 'star'
  };

  // Get selected category
  const selectedCategory = getCategoryById(selectedCategoryId) || defaultCategory;

  const handleCategoryClick = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900"
          >
            <span style={{ color: selectedCategory.color }}>{selectedCategory.icon}</span>
          </div>
          <span className="font-medium">{selectedCategory.name}</span>
        </div>
        <HiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
          {/* Default category option */}
          <button
            type="button"
            onClick={() => handleCategoryClick('default')}
            className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900"
            >
              <span style={{ color: defaultCategory.color }}>{defaultCategory.icon}</span>
            </div>
            <span className="font-medium">{defaultCategory.name}</span>
          </button>
          
          {/* Divider */}
          <div className="my-2 border-t border-gray-200 dark:border-gray-600" />
          
          {/* Other categories */}
          {categories
            .filter((cat: Category) => cat.id !== 'default')
            .map((category: Category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900"
                >
                  <span style={{ color: category.color }}>{category.icon}</span>
                </div>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
