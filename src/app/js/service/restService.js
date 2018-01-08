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

  async persistToDisk() {
    await this.persistToDiskNode();

    return this.fetch(`${this.url}/component/persistToDisk`, 'POST');
  }

  persistToDiskNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=persistToDisk`, 'POST');
  }

  async restoreFromDisk() {
    await this.restoreFromDiskNode();
    return this.fetch(`${this.url}/component/restoreFromDisk`, 'POST');
  }

  restoreFromDiskNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=restoreFromDisk`, 'POST');
  }

  getCollection(id) {
    return this.fetch(`${this.url}/userData/collections/${id}`, 'GET');
  }

  saveOrb(object) {
    return this.fetch(`${this.url}/userData/collections/`, 'POST', object);
  }

  deleteOrbs(object) {
    return this.fetch(`${this.url}/userData/collections/deleteSome`, 'POST', object);
  }
}

export default new RestService();

