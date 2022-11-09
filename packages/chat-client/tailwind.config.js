module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
