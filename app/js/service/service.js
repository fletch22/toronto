import AppProperties from '../../../appProperties';

class Service {

  constructor() {
    this.url = this.getOrbServerRootUrl();
  }

  getOrbServerRootUrl() {
    const orbServer = AppProperties.orbServer;
    return `${orbServer.scheme}://${orbServer.host}:${orbServer.port}/${orbServer.appContext}/api`;
  }

  fetch(url, method, object) {
    const promise = new Promise((resolve, reject) => {
      const options = {
        method
      };

      if (object) {
        options.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        };
        options.body = JSON.stringify(object);
      }

      function checkStatus(response) {
        if (response.status < 200 || response.status > 300) {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }

        return response;
      }

      function parseJSON(response) {
        return response.json();
      }

      fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          resolve(data);
        }).catch((response) => {
          reject(response);
        });
    });
    return promise;
  }
}

export default Service;

