import jQuery from 'jquery';
import AppProperties from '../../../appProperties';

const RestService = function restService() {
  const self = this;

  self.getOrbServerRootUrl = () => {
    const orbServer = AppProperties.orbServer;
    return `${orbServer.scheme}://${orbServer.host}:${orbServer.port}/${orbServer.appContext}/api`;
  };

  self.getAppContainer = () => jQuery.ajax({
    url: `${self.getOrbServerRootUrl()}/`,
    type: 'get' // Send it through get method
  });

  self.getComponent = (id) => jQuery.ajax({
    url: `${self.getOrbServerRootUrl()}/components/${id}`,
    type: 'get'
  });

  self.addComponent = (object) => jQuery.ajax({
    url: `${self.getOrbServerRootUrl()}/components`,
    type: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(object)
  });
};

export default new RestService();

