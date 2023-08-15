/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{tsx,jsx,js,ts}',
  ],
  theme: {
    extend: {
      scrollbar: ['rounded', 'dark'],
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("daisyui"),
    // eslint-disable-next-line no-undef
    require("tailwind-scrollbar")
  ],

  daisyui: {
    themes:[
      "winter",
      "night"
    ],
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true
  },
  darkMode: ['class', '[data-theme="night"]']
}

