import Service from './Service';

class ComponentService extends Service {

  moveComponent(statePackage, sourceParentId, destinationParentId, childId, ordinalChildTarget) {
    const body = {
      statePackage,
      sourceParentId,
      destinationParentId,
      childId,
      ordinalChildTarget
    };

    const tmpMoveInfo = {
      sourceParentId,
      destinationParentId,
      childId,
      ordinalChildTarget
    };

    c.lo(tmpMoveInfo, 'moveInfo: ');

    return this.fetch(`${this.getOrbServerRootUrl()}/component/move`, 'post', body);
  }
}

export default new ComponentService();
