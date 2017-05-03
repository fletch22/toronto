import restService from './restService';

class CollectionService {

  get(id) {
    return restService.getCollection(id).then((result) => {
      return result;
    });
  }

  persist(orbInternalTypeId, orb) {
    c.l('XXX');
    return Promise.reject();
  }
}

export default new CollectionService();

