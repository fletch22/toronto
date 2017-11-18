import restService from './restService';

class CollectionService {

  get(id) {
    return restService.getCollection(id).then((result) => {
      return result;
    });
  }

  saveOrb(object) {
    return restService.saveOrb(object)
      .then((result) => {
        return result;
      });
  }

  delete(array) {
    return restService.deleteOrbs(array);
  }
}

export default new CollectionService();

