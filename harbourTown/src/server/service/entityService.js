import modelFactory from '../models/modelFactory';

class EntityService {
  getC1OptionDataCollection() {
    const collectionRaw = modelFactory.C1.findAll();
    return collectionRaw.map((item) => {
      return {
        value: item['f2'],
        text: item['f1']
      };
    });
  }
}

export default new EntityService();
