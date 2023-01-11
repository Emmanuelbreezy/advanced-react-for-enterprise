module.exports = {
    addons: ['@storybook/preset-typescript'],
    addons: ['@storybook/addon-essentials'],
    babel: async (options) => ({
      // Update your babel configuration here
      ...options,
    }),
    framework: '@storybook/react',
    stories: ['../src/**/*.stories.tsx']
}