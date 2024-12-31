import React from 'react';
import { useSearch } from '../context/SearchContext';
import { TagInput } from './TagInput';

interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
  onClose: () => void;
}

export const ReminderSearch: React.FC<Props> = ({
  inputRef,
  onClose,
}: Props) => {
  const { state, dispatch } = useSearch();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search Reminders</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Search input */}
          <div>
            <input
              ref={inputRef}
              type="text"
              value={state.searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })
              }
              placeholder="Search reminders..."
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={state.filters.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  dispatch({
                    type: 'SET_STATUS_FILTER',
                    payload: e.target.value,
                  })
                }
                className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={state.filters.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  dispatch({
                    type: 'SET_PRIORITY_FILTER',
                    payload: e.target.value,
                  })
                }
                className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Sort control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort by
              </label>
              <div className="flex gap-2">
                <select
                  value={state.sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch({
                      type: 'SET_SORT',
                      payload: {
                        sortBy: e.target.value,
                        sortDirection: state.sortDirection,
                      },
                    })
                  }
                  className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="priority">Priority</option>
                  <option value="created">Created</option>
                </select>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'SET_SORT',
                      payload: {
                        sortBy: state.sortBy,
                        sortDirection:
                          state.sortDirection === 'asc' ? 'desc' : 'asc',
                      },
                    })
                  }
                  className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  {state.sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Date range filter */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={state.filters.dateRange.start || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({
                      type: 'SET_DATE_RANGE',
                      payload: {
                        ...state.filters.dateRange,
                        start: e.target.value || null,
                      },
                    })
                  }
                  className="block rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={state.filters.dateRange.end || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({
                      type: 'SET_DATE_RANGE',
                      payload: {
                        ...state.filters.dateRange,
                        end: e.target.value || null,
                      },
                    })
                  }
                  className="block rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tag filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by tags
            </label>
            <TagInput
              tags={state.filters.tags}
              onChange={(tags: string[]) => {
                // Remove old tags
                state.filters.tags.forEach((tag: string) => {
                  if (!tags.includes(tag)) {
                    dispatch({ type: 'REMOVE_TAG_FILTER', payload: tag });
                  }
                });
                // Add new tags
                tags.forEach((tag: string) => {
                  if (!state.filters.tags.includes(tag)) {
                    dispatch({ type: 'ADD_TAG_FILTER', payload: tag });
                  }
                });
              }}
              placeholder="Add tags to filter..."
            />
          </div>

          {/* Reset filters button */}
          {(state.searchQuery ||
            state.filters.status !== 'active' ||
            state.filters.priority !== 'all' ||
            state.filters.tags.length > 0 ||
            state.filters.dateRange.start ||
            state.filters.dateRange.end) && (
            <button
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
