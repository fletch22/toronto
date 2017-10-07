import Service from './Service';

class ComponentService extends Service {

  moveComponent(statePackage, sourceParentId, destinationParentId, childId) {
    const body = {
      statePackage,
      sourceParentId,
      destinationParentId,
      childId
    };

    return this.fetch(`${this.getOrbServerRootUrl()}/component/move`, 'post', body);
  }
}

export default new ComponentService();
