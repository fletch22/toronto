import Service from './Service';

class RestService extends Service {

  nukeAndPave() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=nukeAndPave`, 'POST');
  }

  persistToDisk() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=persistToDisk`, 'POST');
  }

  restoreFromDisk() {
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

