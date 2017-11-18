import 'expose-loader?$!expose-loader?c!c';

const context = require.context('./', true, /Spec\.js$/);
context.keys().forEach(context);
