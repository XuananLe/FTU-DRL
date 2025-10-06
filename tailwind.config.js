/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Vietnamese-optimized font stack
        'vietnamese': [
          'Inter',
          'Noto Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        // Alias for easier use
        'sans': [
          'Inter',
          'Noto Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      // Vietnamese text optimization
      lineHeight: {
        'vietnamese': '1.65',
        'vietnamese-tight': '1.4',
        'vietnamese-loose': '1.8'
      },
      letterSpacing: {
        'vietnamese': '0.01em',
        'vietnamese-tight': '-0.01em',
        'vietnamese-wide': '0.02em'
      }
    },
  },
  plugins: [],
}