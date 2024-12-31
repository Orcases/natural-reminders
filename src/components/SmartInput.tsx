import React from 'react';

export interface Suggestion {
  id: string;
  text: string;
  type: 'reminder' | 'category' | 'command';
}

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  suggestions?: Suggestion[];
  placeholder?: string;
  className?: string;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  onSubmit,
  onSuggestionSelect,
  suggestions = [],
  placeholder = 'Type your reminder...',
  className = '',
}: SmartInputProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev: number) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev: number) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Tab' && selectedIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestions[selectedIndex];
      if (suggestion) {
        onSuggestionSelect?.(suggestion);
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          autoFocus
        />
      </form>

      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {suggestion.type === 'reminder' && '⏰'}
                  {suggestion.type === 'category' && '🏷️'}
                  {suggestion.type === 'command' && '⚡'}
                </span>
                <span>{suggestion.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
