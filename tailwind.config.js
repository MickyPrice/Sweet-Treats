module.exports = {
  purge: [],
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
}


// npx tailwindcss build styles.css -o ./dist/assets/CSS/tailwind.css
// postcss styles.css -o ./dist/assets/CSS/tailwind.css
