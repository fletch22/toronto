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
}

export default new RestService();

