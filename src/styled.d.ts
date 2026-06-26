import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      bg: string;
      bgLight: string;
      surface: string;
      surfaceGlass: string;
      border: string;
      text: string;
      textSecondary: string;
      accent: string;
      accentGlow: string;
      gold: string;
    };
    fonts: {
      body: string;
      display: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    glassmorphism: string;
  }
}
