import AppProperties from '../../../appProperties';
import jQuery from 'jquery';

class Service {

  constructor() {
    this.url = this.getOrbServerRootUrl();
  }

  getOrbServerRootUrl() {
    const orbServer = AppProperties.orbServer;
    return `${orbServer.scheme}://${orbServer.host}:${orbServer.port}/${orbServer.appContext}/api`;
  }

  getNodeServerRootUrl() {
    const nodeServer = AppProperties.nodeServer;
    return `${nodeServer.scheme}://${nodeServer.host}:${nodeServer.port}/api`;
  }

  fetchSynchronous(url, method, object) {
    try {
      return JSON.parse(jQuery.ajax({
        type: method,
        url,
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(object),
        dataType: 'json'
      }).responseText);
    } catch (error) {
      console.error('Encountered error while attempting to asynchronously fetch something.');
      throw error;
    }
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
          return response.text()
            .then((text) => {
              console.error(`'${response.statusText}': '${response.status}'. ${text}`);
              const error = new Error(text);
              error.responseObject = JSON.parse(text);
              throw error;
            });
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
      })
      .catch((error) => {
        reject(error);
      });
    });
    return promise;
  }
}

export default Service;

