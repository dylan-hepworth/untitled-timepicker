module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions"
    ],
    "framework": "@storybook/react",
    webpackFinal: async (config) => {

        delete config.resolve.alias['emotion-theming'];
        delete config.resolve.alias['@emotion/styled'];
        delete config.resolve.alias['@emotion/core'];


        // add SCSS support for CSS Modules
        config.module.rules.push({
            test: /\.scss$/,
            use: [
                require.resolve("style-loader"),
                require.resolve("css-loader"),
                require.resolve("sass-loader"),
            ],
        });

        return config;
    }
}