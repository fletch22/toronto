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
    return this.fetch(`${this.getOrbServerRootUrl()}/component/move`, 'post', body);
  }
}

export default new ComponentService();
