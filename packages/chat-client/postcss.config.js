const tailwindcss = require("tailwindcss");
const postcssCustomMedia = require("postcss-custom-media");

module.exports = {
  plugins: ["postcss-preset-env", tailwindcss, postcssCustomMedia()],
};
