import Service from './Service';

class ComponentService extends Service {

  moveComponent(sourceParentId, destinationParentId, childId) {
    const body = {
      sourceParentId,
      destinationParentId,
      childId
    };

    return this.fetch(`${this.getOrbServerRootUrl()}/component/move`, 'post', body);
  }
}

export default new ComponentService();
