// @flow
import modelFactory from 'app/js/domain/component/ModelFactory';
import graphTraversal from 'common/state/graphTraversal';
import stateTraversal from 'common/state/stateTraversal';


type Relationship = {
  id: string,
  sourceId: string,
  sourceAttributeName: string,
  targetId: string
}

const CENTRALIZED_REFS = 'centralizedRefs';
class RelationshipUtils {

  createNewRef(state: Object, sourceId: string, sourceAttributeName: string, targetId: string) {
    const centralizedRefs = state.centralizedRefs;

    const refCandidate = this.createInstance(state, sourceId, sourceAttributeName, targetId);

    // Create Cent Ref
    if (this.doesExist(centralizedRefs, refCandidate)) {
      throw new Error(`Could not create ref '${JSON.stringify(refCandidate)}' because it already exists.`);
    }
    // Add to centralizedRefs
    centralizedRefs.push(refCandidate);

    return refCandidate;
  }

  getCentralizedRelationships(state: Object) {
    return state[CENTRALIZED_REFS];
  }

  getRef(state: Object, refId: any) {
    return this.getCentralizedRelationships(state).find((item) => item.id === refId);
  }

  // getRefInfo(refId, callerId) {
  //   const result = {};
  //
  //   result.ref = this.getRef(refId);
  //
  //   if (!!result.ref) {
  //     if (callerId === result.ref.sourceId) result.isCallerTheSource = true;
  //   }
  //
  //   return result;
  // }
  //
  // canRefBeDeleted(state, refId, itemToBeDeletedId) {
  //   const ref = this.getRef(refId);
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

  doesExist(centralizedRefs: Array<Object>, ref: Object) {
    return !!centralizedRefs.find((item) => {
      let result = true;
      if (item.sourceId !== ref.sourceId
        && item.targetId !== ref.targetId
        && item.sourceAttributeName !== item.sourceAttributeName) {
        result = false;
      }
      return result;
    });
  }

  getAllRelationshipsTargettingId(objectsWithRefs: Array<Object>, itemToBeDeletedId: any): Array<Object> {
    return objectsWithRefs.filter((item) => {
      const id = item.keyToFindAttributeValue;
      const ref = this.getRef(id);

      return itemToBeDeletedId === ref.targetId;
    });
  }

  foo(bar: number) {
    return bar;
  }

  getObjectsDependingOnAnyContainedRefs(state: Object, itemToBeDeletedId: any) {
    // Get all the container's relationships source IDs where the target IDs are in the container.
    // Take that collection and get all the source IDS that are not IDs in the container.
    const node = graphTraversal.find(state, itemToBeDeletedId);
    if (!node) {
      throw new Error(`Could not find node ${itemToBeDeletedId} while trying to getObjectsDependingOnAnyContainedRefs.`);
    }
    const objectsWithRef = graphTraversal.findDescendentsWithAttributeObjectKey(node, stateTraversal.REF_ID_ATTRIBUTE);

    // const relationships = this.getCentralizedRelationships(state);

    const self = this;
    const objectsWithRefsWithTargetIds = objectsWithRef.map((item) => {
      const ref = self.getRef(state, item.keyToFindAttributeValue);
      if (item.id === ref.targetId) {
        return {
          ref: item,
          relationship: ref
        };
      }
    }).filter((item) => item);

    // const objectsWithRefWithSourceIds = objectsWithRef.filter((item) => item.sourceId);

    const containedIds = graphTraversal.findAllAttributeValuesFromDescendentsWithAttribute(node, 'id');

    // const externalSourceIds = containedRefSourceIds.filter((containedTargetId) => {
    //   return !containedIds.includes(containedTargetId);
    // });

    // const leftover = refsThatTargetItem.filter((item) => {
    //   return !containedIds.includes(item.targetId);
    // });
    //
    // return leftover.map((item) => item.targetId);
  }

  // deleteRef(state, refId, itemToBeDeletedId) {
  //
  //
  // }
}

export default new RelationshipUtils();

