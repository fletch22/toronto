import React from 'react';
import AppContainer from '../containers/AppContainer';
import DevTools from '../containers/DevTools';
import RollbackBroadcastHandler from '../domain/message/rollbackBroadastHandler';
import { actionEnsureInitialStateSaved } from '../actions/index';

class App extends React.Component {

  componentDidMount() {
    const handler = new RollbackBroadcastHandler(this.context.store.dispatch);
    handler.initialize();

    this.context.store.dispatch(actionEnsureInitialStateSaved());
  }

  render() {
    return (
      <div className="container-fluid">
        <AppContainer numberApps="0" />
      </div>
    );
  }
}

App.contextTypes = { store: React.PropTypes.object };

export default App;
