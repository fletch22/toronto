import componentService from './componentService';

class MoveComponentService {

  static move(sourceParentId, destinationParentId, childId) {
    return componentService.moveComponent(sourceParentId, destinationParentId, childId);
  }
}

export default MoveComponentService;

