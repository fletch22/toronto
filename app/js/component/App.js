import React from 'react';
import AppContainer from '../containers/AppContainer';
import DevTools from '../containers/DevTools';
import StandardModal from '../component/modals/StandardModal';
import RollbackBroadcastHandler from '../domain/message/rollbackBroadastHandler';

const App = () => (
  <div className="container-fluid">
    <AppContainer numberApps="0" />
    <StandardModal />
    <DevTools />
  </div>
);

new RollbackBroadcastHandler().initialize();


export default App;
