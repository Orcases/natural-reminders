interface ThemeColors {
  background: string;
  border: string;
  text: string;
  primary: string;
}

interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface ThemeShadows {
  panel: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
}

export const theme: Theme = {
  colors: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#374151',
    primary: '#10b981'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  shadows: {
    panel: '0 0 10px rgba(0, 0, 0, 0.1)'
  }
}; 
