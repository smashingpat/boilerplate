module.exports = (api) => {
    api.cache(true);

    const isProduction = process.env.NODE_ENV === 'production';

    return {
        presets: [
            ["@babel/preset-env", {
                modules: false,
                loose: true,
                useBuiltIns: 'entry',
                shippedProposals: true,
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
            isProduction && '@babel/plugin-transform-react-constant-elements',
            isProduction && '@babel/plugin-transform-react-inline-elements'
        ].filter(p => !!p),
    };
}