const context = require.context('./app/js/__tests__/', true, /Spec\.js$/);
context.keys().forEach(context);
