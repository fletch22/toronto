var alt = require('../lib/alt');

class AppActions {
  addApp(app) {
    return app;
  }
}

module.exports = alt.createActions(AppActions);
