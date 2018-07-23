// flow
// import modelFactory from 'app/js/domain/component/ModelFactory';
// import graphTraversal from 'common/state/graphTraversal';
// import stateTraversal from 'common/state/stateTraversal';

// const CENTRALIZED_REFS = 'centralizedRefs';
class RelationshipUtils {

  foo(bar: String) {
    return bar;
  }

  foo2(bar: number) {
    return bar;
  }

  bar() {
    this.foo(134);
  }

  createNewRef(state, sourceId, sourceAttributeName, targetId) {
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

  // getCentralizedRelationships(state) {
  //   return state[CENTRALIZED_REFS];
  // }
  //
  // getRef(refId) {
  //   return this.getCentralizedRelationships().find((item) => item.id === refId);
  // }
  //
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
  //
  // createInstance(state, sourceId, sourceAttributeName, targetId) {
  //   const id = modelFactory.getNextId(state);
  //
  //   return {
  //     id: id,
  //     sourceId: sourceId,
  //     sourceAttributeName: sourceAttributeName,
  //     targetId: targetId
  //   };
  // }
  //
  // doesExist(centralizedRefs, ref) {
  //   return !!centralizedRefs.find((item) => {
  //     let result = true;
  //     if (item.sourceId !== ref.sourceId
  //       && item.targetId !== ref.targetId
  //       && item.sourceAttributeName !== item.sourceAttributeName) {
  //       result = false;
  //     }
  //     return result;
  //   });
  // }

  // getAllRelationshipsTargettingId(objectsWithRefs, itemToBeDeletedId) {
  //   return objectsWithRefs.filter((item) => {
  //     const id = item.keyToFindAttributeValue;
  //     const ref = this.getRef(id);
  //
  //     return itemToBeDeletedId === ref.targetId;
  //   });
  // }

  // getObjectsDependingOnAnyContainedRefs(state, itemToBeDeletedId) {
  //   // Get all the container's relationships source IDs where the target IDs are in the container.
  //   // Take that collection and get all the source IDS that are not IDs in the container.
  //   const node = graphTraversal.find(state, itemToBeDeletedId);
  //   const objectsWithRef = graphTraversal.findDescendentsWithAttributeObjectKey(node, stateTraversal.REF_ID_ATTRIBUTE);
  //
  //   // const relationships = this.getCentralizedRelationships(state);
  //
  //   this.foo(123);
  //
  //   const objectsWithRefsWithTargetIds = objectsWithRef.map((item) => {
  //     const ref = this.getRef(item.keyToFindAttributeValue);
  //     if (item.id === ref.targetId) {
  //       return {
  //         ref: item,
  //         relationship: ref
  //       };
  //     }
  //   }).filter((item) => item);
  //
  //   // const objectsWithRefWithSourceIds = objectsWithRef.filter((item) => item.sourceId);
  //
  //   const containedIds = graphTraversal.findAllAttributeValuesFromDescendentsWithAttribute(node, 'id');
  //
  //   // const externalSourceIds = containedRefSourceIds.filter((containedTargetId) => {
  //   //   return !containedIds.includes(containedTargetId);
  //   // });
  //
  //   // const leftover = refsThatTargetItem.filter((item) => {
  //   //   return !containedIds.includes(item.targetId);
  //   // });
  //   //
  //   // return leftover.map((item) => item.targetId);
  // }
  //
  // deleteRef(state, refId, itemToBeDeletedId) {
  //
  //
  // }
}

export default new RelationshipUtils();

