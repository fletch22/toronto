import RestService from '../restService';

class ComponentService {
  delete(id) {
    return RestService.deleteComponent(id);
  }

  _addComponent(object) {
    return RestService.addComponent(object);
  }

  _updateComponent(object) {
    return RestService.updateComponent(object);
  }
}

export default ComponentService;