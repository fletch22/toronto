const context = require.context('./', true, /orSpec\.js$/);
context.keys().forEach(context);
