// frontend/.storybook/main.js

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(config) {
    try {
      return { ...config };
    } catch (error) {
      console.error('Storybook config error:', error.message);
      return config;
    }
  },
};

export default config;