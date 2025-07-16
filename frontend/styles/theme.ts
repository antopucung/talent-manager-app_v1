export const theme = {
  colors: {
    // Vibrant Primary Colors - Electric Blue to Purple
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main electric blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    
    // Secondary - Electric Purple to Pink
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Main electric purple
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    
    // Accent Colors - Neon & Electric
    accent: {
      neon: '#00ff88', // Electric green
      orange: '#ff6b35', // Electric orange
      pink: '#ff0080', // Hot pink
      cyan: '#00d4ff', // Electric cyan
      yellow: '#ffed4e', // Electric yellow
      red: '#ff3366', // Electric red
    },
    
    // Dark Theme
    dark: {
      50: '#18181b',
      100: '#27272a',
      200: '#3f3f46',
      300: '#52525b',
      400: '#71717a',
      500: '#a1a1aa',
      600: '#d4d4d8',
      700: '#e4e4e7',
      800: '#f4f4f5',
      900: '#fafafa',
    },
    
    // Status Colors - Vibrant
    status: {
      success: '#00ff88',
      warning: '#ffed4e',
      error: '#ff3366',
      info: '#00d4ff',
    },
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
      secondary: 'linear-gradient(135deg, #d946ef 0%, #ff0080 100%)',
      success: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      dark: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      neon: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #d946ef 100%)',
      fire: 'linear-gradient(135deg, #ff6b35 0%, #ff0080 100%)',
    }
  },
  
  typography: {
    fonts: {
      display: '"Space Grotesk", sans-serif', // Modern, tech-forward
      body: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
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
  
  animations: {
    glow: 'glow 2s ease-in-out infinite alternate',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    float: 'float 3s ease-in-out infinite',
    shimmer: 'shimmer 2s linear infinite',
  },
  
  effects: {
    glassmorphism: 'backdrop-blur-xl bg-white/10 border border-white/20',
    neonGlow: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
    electricGlow: 'shadow-[0_0_30px_rgba(14,165,233,0.6)]',
    pinkGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.5)]',
  }
} as const;

export type Theme = typeof theme;
