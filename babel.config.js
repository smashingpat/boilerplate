module.exports = (api) => {
    api.cache(true);

    const enviroment = process.env.NODE_ENV;

    return {
        presets: [
            ["@babel/preset-env", {
                modules: enviroment !== 'test'
                    ? false
                    : undefined,
                loose: true,
                useBuiltIns: 'entry',
            }],
            ['@babel/preset-react', {
                loose: true,
            }],
            "@babel/preset-typescript"
        ],
        plugins: [
            "babel-plugin-lodash",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-spread",
            enviroment === 'production' && '@babel/plugin-transform-react-constant-elements',
            enviroment === 'production' && '@babel/plugin-transform-react-inline-elements',
            enviroment !== 'test' && ['babel-plugin-remove-test-ids', {
                attributes: ['data-testid'],
            }],
        ].filter(p => !!p),
    };
}