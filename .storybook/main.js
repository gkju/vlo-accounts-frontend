module.exports = {
  stories: [
    "../src/Components/**/*.stories.tsx",
    "../src/Components/*.stories.tsx"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/preset-create-react-app",
      options: {
        scriptsPackageName: 'react-scripts'
      }
    }
  ],
  framework: "@storybook/react",
  core: {
    "builder": "webpack5"
  }
}
