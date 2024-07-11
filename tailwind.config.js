/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      screens: {
        'xxs' : '250px' , // small mobile to mobile breakpoint
        'xs'  : '450px' , // mobile to tablet & small screen breakpoint
        's'   : '1000px', // tablet & small screen to desktop breakpoint
        'l'   : '2000px', // desktop to very large screen breakpoint
      }
    },
  },
  plugins: [],
}
