// @flow
import modelFactory from 'app/js/domain/component/ModelFactory';
import graphTraversal from 'common/state/graphTraversal';
import stateTraversal from 'common/state/stateTraversal';


export type Relationship = {
  id: string,
  sourceId: string,
  sourceAttributeName: string,
  targetId: string
}

export type DescendentRelationship = {
  descendent: Object,
  relationship: Relationship
}

const CENTRALIZED_REFS = 'centralizedRelationships';
class RelationshipUtils {

  createNewRef(state: Object, sourceId: any, sourceAttributeName: string, targetId: any) {
    const centralizedRels = state.centralizedRelationships;

    const relationship = this.createInstance(state, sourceId, sourceAttributeName, targetId);

    // Create Cent Ref
    if (this.doesExist(centralizedRels, relationship)) {
      throw new Error(`Could not create ref '${JSON.stringify(relationship)}' because it already exists.`);
    }
    // Add to centralizedRelationships
    centralizedRels.push(relationship);

    return relationship;
  }

  getCentralizedRelationships(state: Object) {
    return state[CENTRALIZED_REFS];
  }

  getRelationship(state: Object, refId: number): Relationship {
    return this.getCentralizedRelationships(state).find((item) => item.id === refId);
  }

  // getRefInfo(refId, callerId) {
  //   const result = {};
  //
  //   result.ref = this.getRelationship(refId);
  //
  //   if (!!result.ref) {
  //     if (callerId === result.ref.sourceId) result.isCallerTheSource = true;
  //   }
  //
  //   return result;
  // }
  //
  // canRefBeDeleted(state, refId, itemToBeDeletedId) {
  //   const ref = this.getRelationship(refId);
  //
  //   if (!!ref && ref.targetId === itemToBeDeletedId) {
  //     const source = graphTraversal.find(state, ref.sourceId);
  //     throw new Error(`Encountered a problem attempting to delete item with id ${itemToBeDeletedId}. Item is referenced by source with id ${ref.sourceId} (type ${source.typeLabel}).`);
  //   }
  // }

  createInstance(state: Object, sourceId: string, sourceAttributeName: string, targetId: string): Relationship {
    const id = modelFactory.getNextId(state);

    return {
      id: id,
      sourceId: sourceId,
      sourceAttributeName: sourceAttributeName,
      targetId: targetId
    };
  }

  doesExist(centralizedRefs: Array<Relationship>, ref: Object) {
    return !!centralizedRefs.find((item) => {
      let result = false;
      if (item.sourceId === ref.sourceId
        && item.targetId === ref.targetId
        && item.sourceAttributeName === item.sourceAttributeName) {
        result = true;
      }
      return result;
    });
  }

  getAllRelationshipsTargettingId(state: Object, objectsWithRefs: Array<Object>, itemToBeDeletedId: any): Array<Object> {
    return objectsWithRefs.filter((item) => {
      const id = item.keyToFindAttributeValue;
      const ref = this.getRelationship(state, id);

      return itemToBeDeletedId === ref.targetId;
    });
  }

  getDescendentsThatAreTargets(state: Object, node: Object): Array<DescendentRelationship> {
    const descendentsWithRef = graphTraversal.findDescendentsWithAttributeObjectKey(node, stateTraversal.REF_ID_ATTRIBUTE);

    const self = this;
    const foos = descendentsWithRef.map((descendent) => {
      const relationship = self.getRelationship(state, descendent.keyToFindAttributeValue);
      if (descendent.id === relationship.targetId) {
        return {
          descendent: descendent,
          relationship: relationship
        };
      }
    });

    return foos.filter(Boolean);
  }

  getDescendentsWithExternalSourceIds(state: Object, itemId: any): Array<DescendentRelationship> {
    // Get all the container's relationships source IDs where the target IDs are in the container.
    // Take that collection and get all the source IDS that are not IDs in the container.
    const node = graphTraversal.find(state, itemId);
    if (!node) {
      throw new Error(`Could not find node ${itemId} while trying to get descendents with external source IDs.`);
    }

    const objectsWithRefsWithTargetIds = this.getDescendentsThatAreTargets(state, node);

    const descendentIds = graphTraversal.traverseAndCollect(node, 'id');
    return objectsWithRefsWithTargetIds.filter((item) => {
      return !descendentIds.includes(item.relationship.sourceId);
    }).map((item) => item.descendent);
  }
}

export default new RelationshipUtils();

