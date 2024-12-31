export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Shortcut {
  key: string;
  description: string;
}

export interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

export interface Tag {
  id: string;
  text: string;
  type: string;
}

export interface CategorySelectorProps {
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
}

export interface KeyboardShortcutsHelpProps {
  shortcuts: Shortcut[];
  onClose: () => void;
}

export interface OnboardingProps {
  title: string;
  description: string;
  image?: string;
  onClose: () => void;
}

export interface ReminderSearchProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
}

export interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestionSelect: (suggestion: Tag) => void;
}

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
} 