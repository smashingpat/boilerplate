/* eslint-disable no-console */
const hmrClient = require('webpack-hot-middleware/client?reload=true&quiet=true');

const infoStyles = 'color:lime;font-weight:bold;';
const textStyles = 'color:gray;font-weight:normal;';

function log(logFunc, ...args) {
    logFunc.apply(logFunc, [
        `%c[HMR]%c - ${args.join(' ')}`,
        infoStyles,
        textStyles,
    ]);
}

hmrClient.subscribeAll((ev = {}) => {
    const { warnings } = ev;
    const { errors } = ev;
    switch (ev.action) {
        case 'sync':
        case 'building':
            log(console.log, 'building');
            break;
        case 'built':
            log(
                console.groupCollapsed,
                `built, warnings: ${warnings.length} - errors: ${
                    errors.length
                }`,
            );
            if (warnings.length > 0) {
                console.groupCollapsed(
                    `%cwarnings: ${warnings.length}`,
                    textStyles,
                );
                console.log(`%c${warnings.join('\n')}`, textStyles);
                console.groupEnd();
            }
            if (errors.length > 0) {
                console.groupCollapsed(
                    `%cerrors: ${errors.length}`,
                    textStyles,
                );
                console.log(`%c${errors.join('\n')}`, textStyles);
                console.groupEnd();
            }
            console.groupEnd();
            break;
        default:
            break;
    }
});
