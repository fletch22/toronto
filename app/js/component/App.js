import React from 'react';
import AppContainer from '../containers/AppContainer';
import DevTools from '../containers/DevTools';
import RollbackBroadcastHandler from '../domain/message/rollbackBroadastHandler';

class App extends React.Component {

  componentDidMount() {
    const handler = new RollbackBroadcastHandler(this.context.store.dispatch);
    handler.initialize();
  }

  render() {
    return (
      <div className="container-fluid">
        <AppContainer numberApps="0" />
        <DevTools />
      </div>
    );
  }
}

App.contextTypes = { store: React.PropTypes.object };

export default App;
