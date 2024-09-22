module.exports = {
  content: [
    "./src/**/*.{js,jsx}",  // Ensure Tailwind applies to your components
    "./node_modules/preline/dist/*.js",  // Preline components
  ],
  theme: {
    extend: {},
  },
  plugins: [require('preline/plugin')],  // Only Preline plugin
};
