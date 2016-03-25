import AppProperties from '../../../appProperties';

class Service {
  getOrbServerRootUrl() {
    const orbServer = AppProperties.orbServer;
    return `${orbServer.scheme}://${orbServer.host}:${orbServer.port}/${orbServer.appContext}/api`;
  }
}

export default Service;

