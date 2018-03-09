import Service from './Service';

class RestService extends Service {
  getOptionCollection(name) {
    return this.fetch(`${this.getNodeServerRootUrl()}/options/${name}`, 'GET');
  }
}

export default new RestService();

