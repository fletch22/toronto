import jQuery from 'jquery';
import AppProperties from '../../../appProperties';

const RestService = function restService() {
  const self = this;

  self.getOrbServerRootUrl = () => {
    const orbServer = AppProperties.orbServer;
    return `${orbServer.scheme}://${orbServer.host}:${orbServer.port}/${orbServer.appContext}`;
  };

  self.getAppContainer = () => jQuery.ajax({
    url: `${self.getOrbServerRootUrl()}/appContainer`,
    type: 'get' // Send it through get method
  });

  self.addAppToContainer = (parentId, label) => jQuery.ajax({
    url: `${self.getOrbServerRootUrl()}/addAppToContainer`,
    type: 'post', // Send it through get method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      parentId,
      label
    })
  });
};

export default new RestService();
