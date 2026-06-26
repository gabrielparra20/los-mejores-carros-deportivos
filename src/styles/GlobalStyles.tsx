import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bg: '#0a0a0f',
    bgLight: '#12121a',
    surface: '#1a1a28',
    surfaceGlass: 'rgba(26, 26, 40, 0.6)',
    border: 'rgba(255, 255, 255, 0.06)',
    text: '#f0f0f5',
    textSecondary: '#8888a0',
    accent: '#e63946',
    accentGlow: '#ff4d5a',
    gold: '#d4a853',
  },
  fonts: {
    body: "'Inter', sans-serif",
    display: "'Orbitron', monospace",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  glassmorphism: `
    background: rgba(18, 18, 26, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  `,
};

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 700;
    line-height: 1.2;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 3px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.bg};
  }
`;

export default GlobalStyles;
