import React from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tags...',
  className = '',
}: TagInputProps) => {
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput]);
    }
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_: string, i: number) => i !== index));
  };

  React.useEffect(() => {
    // Focus input when tags change
    inputRef.current?.focus();
  }, [tags.length]);

  return (
    <div
      className={`flex flex-wrap gap-2 p-2 border rounded-lg bg-white dark:bg-gray-700 ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
};
