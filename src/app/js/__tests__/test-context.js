import 'expose-loader?c!../../../util/c';

const context = require.context('./', true, /Spec\.js$/);
context.keys().slice(0, 27).forEach(context);
