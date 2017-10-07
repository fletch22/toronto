import componentService from './componentService';

class MoveComponentService {

  static move(statePackage, sourceParentId, destinationParentId, childId) {
    return componentService.moveComponent(statePackage, sourceParentId, destinationParentId, childId);
  }
}

export default MoveComponentService;

