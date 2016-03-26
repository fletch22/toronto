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

      fetch(url, options)
        .then((response) => {
          if (response.status >= 400) {
            throw response;
          }

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }
}

export default Service;

