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
    const svelteLoaderIndex = config.module.rules.findIndex(rule => rule.loader && rule.loader.includes('svelte-loader'));
    // include svelte-preprocess (must be detected by the storybook project)
    config.module.rules[svelteLoaderIndex] = {
      test: /\.(svelte|html)$/,
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