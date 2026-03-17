export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        teal: {
          50:'#edfaf9', 100:'#d1f4f2', 200:'#a3e9e5',
          500:'#1aada6', 600:'#0a6e68', 700:'#095e59', 800:'#074d48',
        },
      },
    },
  },
  plugins: [],
}
