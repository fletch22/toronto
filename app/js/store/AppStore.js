import alt from '../lib/alt';
import AppActions from '../action/AppActions';

class AppStore {
  constructor() {
    this.apps = [];

    this.bindListeners({
      addApp: AppActions.ADD_APP
    });
  }   

  addApp(app) {
    this.apps.push(app);
    console.log("TEEST TESTTEEST TESTTEEST TESTTEEST TESTTEEST TEST");
    console.log(JSON.stringify(app));
  }
}

module.exports = alt.createStore(AppStore, 'AppStore');
