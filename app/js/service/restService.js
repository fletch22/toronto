import Service from './service';

class RestService extends Service {

  getAppContainer() {
    return this.fetch(`${this.url}/`, 'get');
  }

  getComponent(id) {
    return this.fetch(`${this.url}/components/${id}`, 'get');
  }

  addComponent(object) {
    return this.fetch(`${this.url}/components`, 'POST', object);
  }
}

export default new RestService();

