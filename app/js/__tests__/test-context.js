import 'expose?$!expose?c!c';

const context = require.context('./', true, /Spec\.js$/);
context.keys().forEach(context);
