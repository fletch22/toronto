import componentService from './componentService';

class MoveComponentService {

  static move(statePackage, sourceParentId, destinationParentId, childId, ordinalChildTarget) {
    return componentService.moveComponent(statePackage, sourceParentId, destinationParentId, childId, ordinalChildTarget);
  }
}

export default MoveComponentService;

