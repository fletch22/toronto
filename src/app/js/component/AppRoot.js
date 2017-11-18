import React from 'react';
import AppContainer from '../component/AppContainer';
import RollbackBroadcastHandler from '../domain/message/rollbackBroadastHandler';
import { actionInitializeApp } from '../actions/index';
import 'expose-loader?c!../../../util/c'; // Globally exposes the an instance of 'c' class (a custom console class).
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../../css/modules/container.scss';

class App extends React.Component {

  componentDidMount() {
    const handler = new RollbackBroadcastHandler(this.context.store.dispatch);
    handler.initialize();

    this.context.store.dispatch(actionInitializeApp());
  }

  render() {
    return (
      <div className="f22-app-root container-fluid">
        <AppContainer numberApps="0" />
      </div>
    );
  }
}

App.contextTypes = { store: React.PropTypes.object };

App = dragDropContext(HTML5Backend)(App);

export default App;
