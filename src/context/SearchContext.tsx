import React from 'react';
import { Reminder } from '../types/reminder';

interface SearchState {
  searchQuery: string;
  filters: {
    status: 'all' | 'active' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
    tags: string[];
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  sortBy: 'date' | 'priority' | 'created';
  sortDirection: 'asc' | 'desc';
}

type SearchAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: SearchState['filters']['status'] }
  | { type: 'SET_PRIORITY_FILTER'; payload: SearchState['filters']['priority'] }
  | { type: 'ADD_TAG_FILTER'; payload: string }
  | { type: 'REMOVE_TAG_FILTER'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: SearchState['filters']['dateRange'] }
  | { type: 'SET_SORT'; payload: { sortBy: SearchState['sortBy']; sortDirection: SearchState['sortDirection'] } }
  | { type: 'RESET_FILTERS' };

const initialState: SearchState = {
  searchQuery: '',
  filters: {
    status: 'active',
    priority: 'all',
    tags: [],
    dateRange: {
      start: null,
      end: null,
    },
  },
  sortBy: 'date',
  sortDirection: 'desc',
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, status: action.payload },
      };
    case 'SET_PRIORITY_FILTER':
      return {
        ...state,
        filters: { ...state.filters, priority: action.payload },
      };
    case 'ADD_TAG_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          tags: [...state.filters.tags, action.payload],
        },
      };
    case 'REMOVE_TAG_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          tags: state.filters.tags.filter((tag: string) => tag !== action.payload),
        },
      };
    case 'SET_DATE_RANGE':
      return {
        ...state,
        filters: { ...state.filters, dateRange: action.payload },
      };
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  filterReminders: (reminders: Reminder[]) => Reminder[];
}

interface SearchProviderProps {
  children: React.ReactNode;
}

const SearchContext = React.createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: SearchProviderProps) {
  const [state, dispatch] = React.useReducer(searchReducer, initialState);

  const filterReminders = React.useCallback(
    (reminders: Reminder[]) => {
      let filtered = [...reminders];

      // Apply search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (reminder: Reminder) =>
            reminder.title.toLowerCase().includes(query) ||
            (reminder.description?.toLowerCase().includes(query) ?? false) ||
            reminder.tags.some((tag: string) => tag.toLowerCase().includes(query))
        );
      }

      // Apply status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter((reminder: Reminder) =>
          state.filters.status === 'completed'
            ? reminder.completed
            : !reminder.completed
        );
      }

      // Apply priority filter
      if (state.filters.priority !== 'all') {
        filtered = filtered.filter(
          (reminder: Reminder) => reminder.priority === state.filters.priority
        );
      }

      // Apply tag filters
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter((reminder: Reminder) =>
          state.filters.tags.some((tag: string) => reminder.tags.includes(tag))
        );
      }

      // Apply date range filter
      if (state.filters.dateRange.start || state.filters.dateRange.end) {
        filtered = filtered.filter((reminder: Reminder) => {
          const reminderDate = new Date(reminder.date);
          const start = state.filters.dateRange.start
            ? new Date(state.filters.dateRange.start)
            : null;
          const end = state.filters.dateRange.end
            ? new Date(state.filters.dateRange.end)
            : null;

          if (start && end) {
            return reminderDate >= start && reminderDate <= end;
          } else if (start) {
            return reminderDate >= start;
          } else if (end) {
            return reminderDate <= end;
          }
          return true;
        });
      }

      // Apply sorting
      filtered.sort((a: Reminder, b: Reminder) => {
        let comparison = 0;
        switch (state.sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'priority': {
            const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };
            comparison =
              priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
            break;
          }
          case 'created':
            comparison = a.created.getTime() - b.created.getTime();
            break;
        }
        return state.sortDirection === 'asc' ? comparison : -comparison;
      });

      return filtered;
    },
    [state]
  );

  return (
    <SearchContext.Provider value={{ state, dispatch, filterReminders }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
