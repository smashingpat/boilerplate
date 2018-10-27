const path = require('path');

module.exports = {
    ENTRY_PATH: './source/main',
    OUT_PATH: path.resolve(__dirname, '../_dist'),
    PUBLIC_PATH: '/',
    PUBLIC_STATIC_PATH: 'static',
};
