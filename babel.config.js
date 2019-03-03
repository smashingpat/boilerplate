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
                shippedProposals: true,
                targets: {
                    node: 'current',
                },
            }],
            ['@babel/preset-react', {
                useBuiltIns: true,
                loose: true,
            }],
            "@babel/preset-typescript"
        ],
        plugins: [
            "babel-plugin-lodash",
            "@babel/plugin-syntax-dynamic-import",
            ["@babel/plugin-transform-runtime", {
                useESModules: true
            }],
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-spread",
            enviroment === 'production' && '@babel/plugin-transform-react-constant-elements',
            enviroment === 'production' && '@babel/plugin-transform-react-inline-elements'
        ].filter(p => !!p),
    };
}