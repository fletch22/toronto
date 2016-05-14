import Service from './service';

class RestService extends Service {

  getAppContainer() {
    return this.fetch(`${this.url}/appContainer/`, 'get');
  }

  addComponent(object) {
    return this.fetch(`${this.url}/component`, 'POST', object);
  }

  updateComponent(object) {
    throw 'Not yet implemented';
  }

  deleteComponent(id) {
    throw 'Not yet implemented';
  }

  getExceptionForTesting(value) {
    return this.fetch(`${this.url}/component/getExceptionForTesting`, 'GET', value);
  }
}

export default new RestService();

