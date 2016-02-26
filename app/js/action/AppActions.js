var alt = require('../lib/alt');

class AppActions {
  addApp(app) {
	console.log("In appActions");
	return app;
  }
}

module.exports = alt.createActions(AppActions);
