import React from 'react';
// import Footer from './Footer';
import AppContainer from '../containers/AppContainer';
import DevTools from '../containers/DevTools';

const App = () => (
  <div className="container-fluid">
    <AppContainer numberApps="0" />
    <DevTools />
  </div>
);

export default App;
