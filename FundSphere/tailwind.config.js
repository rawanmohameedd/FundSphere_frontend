/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors:{
        color1: '#7aa5d2', //navbar-bg 
        color2: 'white' //navbar text
      },
      screens:{
        'md': {'max': '850px'} //
      }
    },
  },
  plugins: [],
}

