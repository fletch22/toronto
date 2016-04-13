import Service from './service';

class RestService extends Service {

  getAppContainer() {
    return this.fetch(`${this.url}/appContainer/`, 'get');
  }

  getComponent(id) {
    return this.fetch(`${this.url}/component/${id}`, 'get');
  }

  addComponent(object) {
    return this.fetch(`${this.url}/component`, 'POST', object);
  }
}

export default new RestService();

