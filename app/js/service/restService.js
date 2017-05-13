import Service from './Service';

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

  nukeAndPave() {
    return this.fetch(`${this.url}/component/nukeAndPave`, 'POST');
  }

  persistToDisk() {
    return this.fetch(`${this.url}/component/persistToDisk`, 'POST');
  }

  restoreFromDisk() {
    return this.fetch(`${this.url}/component/restoreFromDisk`, 'POST');
  }

  getCollection(id) {
    return this.fetch(`${this.url}/userData/collections/${id}`, 'GET');
  }

  saveOrb(object) {
    return this.fetch(`${this.url}/userData/collections/`, 'POST', object);
  }
}

export default new RestService();

