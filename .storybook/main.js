module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    config.module.rules[3] = {
      test: /\.(html|svelte)$/,
      exclude: /node_modules/,
      use: {
        loader: 'svelte-loader',
        options: {
          preprocess: require('svelte-preprocess')({})
        },
      },
    };
    return config;
  }
}