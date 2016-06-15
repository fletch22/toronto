import Service from './service';

class RestService extends Service {

  getAppContainer() {
    return this.fetch(`${this.url}/appContainer/`, 'get');
  }

  getRoot() {
    return this.fetch(`${this.url}/root/`, 'get');
  }

  addComponent(object) {
    return this.fetch(`${this.url}/component`, 'POST', object);
  }

  getExceptionForTesting(value) {
    return this.fetch(`${this.url}/component/getExceptionForTesting`, 'GET', value);
  }
}

export default new RestService();

