/// <reference types="chrome"/>
import React from 'react';
import { Category } from '@natural/components/CategorySelector';
import { storageService } from '@natural/services/storage';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const defaultCategory: Category = {
  id: 'default',
  name: 'Default',
  color: '#6B7280', // Gray-500
  icon: '📝'
};

const initialState: CategoryState = {
  categories: [defaultCategory],
  loading: false,
  error: null
};

type CategoryAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; payload: string }
  | { type: 'UPDATE_CATEGORY'; payload: Category };

const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_CATEGORIES':
      return {
        ...state,
        loading: false,
        error: null,
        categories: [defaultCategory, ...action.payload]
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        loading: false,
        error: null,
        categories: [...state.categories, action.payload]
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        loading: false,
        error: null,
        categories: state.categories.filter((cat: Category) => 
          cat.id !== action.payload && cat.id !== 'default'
        )
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        loading: false,
        error: null,
        categories: state.categories.map((cat: Category) =>
          cat.id === action.payload.id && cat.id !== 'default'
            ? action.payload
            : cat
        )
      };
    default:
      return state;
  }
};

interface CategoryContextType {
  state: CategoryState;
  loadCategories: () => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  getCategoryById: (id: string) => Category | null;
}

interface CategoryProviderProps {
  children: React.ReactNode;
}

const CategoryContext = React.createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}: CategoryProviderProps) => {
  const [state, dispatch] = React.useReducer(categoryReducer, initialState);

  const loadCategories = React.useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const categories = await storageService.getAllCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load categories' });
    }
  }, []);

  const addCategory = React.useCallback(async (category: Category) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const categories = await storageService.getAllCategories();
      const updatedCategories = [...categories, category];
      await storageService.saveCategories(updatedCategories);
      dispatch({ type: 'ADD_CATEGORY', payload: category });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
    }
  }, []);

  const removeCategory = React.useCallback(async (id: string) => {
    if (id === 'default') return;
    try {
      dispatch({ type: 'SET_LOADING' });
      const categories = await storageService.getAllCategories();
      const updatedCategories = categories.filter((c: Category) => c.id !== id);
      await storageService.saveCategories(updatedCategories);
      dispatch({ type: 'REMOVE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove category' });
    }
  }, []);

  const updateCategory = React.useCallback(async (category: Category) => {
    if (category.id === 'default') return;
    try {
      dispatch({ type: 'SET_LOADING' });
      const categories = await storageService.getAllCategories();
      const updatedCategories = categories.map((c: Category) =>
        c.id === category.id ? category : c
      );
      await storageService.saveCategories(updatedCategories);
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
    }
  }, []);

  const getCategoryById = React.useCallback((id: string) => {
    if (id === 'default') return defaultCategory;
    return state.categories.find((cat: Category) => cat.id === id) || null;
  }, [state.categories]);

  // Load categories on mount
  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <CategoryContext.Provider
      value={{
        state,
        loadCategories,
        addCategory,
        removeCategory,
        updateCategory,
        getCategoryById
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = React.useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
