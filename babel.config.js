module.exports = api => {
    api.cache(true);

    const enviroment = process.env.NODE_ENV;

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: enviroment !== 'test' ? false : undefined,
                    loose: true,
                    corejs: '3.0.0',
                    useBuiltIns: 'usage',
                },
            ],
            [
                '@babel/preset-react',
                {
                    loose: true,
                },
            ],
            '@babel/preset-typescript',
        ],
        plugins: [
            'babel-plugin-lodash',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-spread',
            enviroment !== 'test' && [
                'babel-plugin-remove-test-ids',
                {
                    attributes: ['data-testid'],
                },
            ],
        ].filter(p => !!p),
    };
};
