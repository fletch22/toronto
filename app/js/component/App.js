import React from 'react';
import AppContainer from '../containers/AppContainer';
import DevTools from '../containers/DevTools';
import StandardModal from '../component/modals/StandardModal';

const App = () => (
  <div className="container-fluid">
    <AppContainer numberApps="0" />
    <StandardModal />
    <DevTools />
  </div>
);

export default App;
