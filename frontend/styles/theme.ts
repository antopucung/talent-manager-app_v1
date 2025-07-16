export const theme = {
  colors: {
    // Apple-inspired neutral palette
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    
    // Sophisticated accent colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Film industry inspired colors
    film: {
      gold: '#d4af37',
      silver: '#c0c0c0',
      bronze: '#cd7f32',
      platinum: '#e5e4e2',
      charcoal: '#36454f',
      midnight: '#191970',
    },
    
    // Status colors - subtle and refined
    status: {
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    
    // Glass morphism and transparency
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      dark: 'rgba(0, 0, 0, 0.1)',
      darker: 'rgba(0, 0, 0, 0.2)',
    }
  },
  
  typography: {
    fonts: {
      display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    },
    
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
    },
  },
  
  spacing: {
    section: {
      xs: '2rem',
      sm: '3rem',
      md: '4rem',
      lg: '6rem',
      xl: '8rem',
    },
    container: {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '3rem',
    }
  },
  
  animations: {
    subtle: 'all 0.2s ease-out',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  effects: {
    blur: {
      light: 'backdrop-blur-sm',
      medium: 'backdrop-blur-md',
      heavy: 'backdrop-blur-xl',
    },
    shadow: {
      subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }
  }
} as const;

export type Theme = typeof theme;
