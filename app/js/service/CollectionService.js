import restService from './restService';

class CollectionService {

  get(id) {
    return restService.getCollection(id).then((result) => {
      return result;
    });
  }
}

export default new CollectionService();

