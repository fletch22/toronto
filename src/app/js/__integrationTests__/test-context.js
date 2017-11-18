const Promise = require('es6-promise').Promise;
const context = require.context('./', true, /Spec\.js$/);
context.keys().forEach(context);
