import modelFactory from '../models/modelFactory';

class EntityService {
  getC1Collection() {
    return modelFactory.C1.findAll();
  }
}

export default new EntityService();
