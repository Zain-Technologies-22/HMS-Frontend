import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',  // Includes all files in app/ directory
    './src/components/**/*.{js,ts,jsx,tsx}', // Includes all files in components/ directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8', // Add custom colors if needed
        secondary: '#9333ea',
      },
    },
  },
  plugins: [],
};

export default config;
