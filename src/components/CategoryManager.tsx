import React from 'react';
import { useCategories } from '@natural/context/CategoryContext';
import type { Category } from './CategorySelector';
import { HiPlus, HiTrash } from 'react-icons/hi2';

const colorOptions = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6B7280', // Gray
];

const iconOptions = [
  '📝', '📌', '🏠', '💼', '🎯', '📚', '💡', '🎨', '🔧', '🎮',
  '🎵', '🏃', '🍳', '🌟', '❤️', '🔔', '📅', '✉️', '🔑', '⚡️'
];

interface CategoryFormState {
  name: string;
  color: string;
  icon: string;
}

export const CategoryManager: React.FC = () => {
  const { state: { categories }, addCategory, removeCategory } = useCategories();
  const [isAdding, setIsAdding] = React.useState(false);
  const [formState, setFormState] = React.useState<CategoryFormState>({
    name: '',
    color: colorOptions[0],
    icon: iconOptions[0]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: formState.name,
      color: formState.color,
      icon: formState.icon
    };

    try {
      await addCategory(newCategory);
      setFormState({ name: '', color: colorOptions[0], icon: iconOptions[0] });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleColorChange = (color: string) => {
    setFormState((prev: CategoryFormState) => ({ ...prev, color }));
  };

  const handleIconChange = (icon: string) => {
    setFormState((prev: CategoryFormState) => ({ ...prev, icon }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: CategoryFormState) => ({ ...prev, name: e.target.value }));
  };

  return (
    <div className="space-y-4">
      {/* Add Category Button */}
      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      )}

      {/* Add Category Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Category name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full ${formState.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <div className="grid grid-cols-10 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconChange(icon)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
                    formState.icon === icon
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                  style={{ color: formState.color }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Category
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {categories.filter((cat: Category) => cat.id !== 'default').map((category: Category) => (
          <div
            key={category.id}
            className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl" style={{ color: category.color }}>{category.icon}</span>
              <span>{category.name}</span>
            </div>
            <button
              type="button"
              onClick={() => removeCategory(category.id)}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 