const sveltePreprocess = require("svelte-preprocess");
const path = require("path");

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],

  // From https://github.com/storybookjs/storybook/blob/master/examples/svelte-kitchen-sink/.storybook/main.js
  svelteOptions: {
    preprocess: sveltePreprocess(),
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      use: [require.resolve("@storybook/source-loader")],
      include: [path.resolve(__dirname, "../src")],
      enforce: "pre",
    });
    return config;
  },
  core: {
    builder: "webpack4",
  },
}