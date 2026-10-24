export default {
  content: [
    "./index.html",
    "./admin.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        choco: '#2C1810',
        chocoDark: '#1A120D',
        cream: '#FFFBF7',
        gold: '#C5A572',
        gold2: '#D4B483',
        pinkSoft: '#F8C8C0'
      },
      fontFamily: {
        serif: ['Playfair Display','serif'],
        sans: ['Inter','sans-serif'],
        script: ['Dancing Script','cursive']
      }
    }
  },
  plugins: []
}