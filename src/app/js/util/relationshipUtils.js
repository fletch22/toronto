// @flow
import ModelFactory from 'app/js/domain/component/ModelFactory';
import graphTraversal from 'common/state/graphTraversal';
import stateTraversal from 'common/state/stateTraversal';

export type Relationship = {
  id: string,
  sourceId: string,
  sourceAttributeName: string,
  targetId: string
}

export type DescendantRelationship = {
  descendant: Object,
  relationship: Relationship
}

const CENTRALIZED_REFS = 'centralizedRelationships';

class RelationshipUtils {

  _getCentralizedRelationships(state: Object): Array<Relationship> {
    return state[CENTRALIZED_REFS];
  }

  _createInstance(state: Object, sourceId: string, sourceAttributeName: string, targetId: string): Relationship {
    const id = new ModelFactory().getNextId(state);

    return {
      id,
      sourceId,
      sourceAttributeName,
      targetId
    };
  }

  _doesExist(state: Object, sourceId: string | number, sourceAttributeName: string, targetId: string | number): Boolean {
    return !!this._getCentralizedRelationships(state).find((item) => {
      let result = false;
      if (item.sourceId === sourceId
        && item.targetId === targetId
        && item.sourceAttributeName === sourceAttributeName) {
        result = true;
      }
      return result;
    });
  }

  // getAllRelationshipsTargettingId(state: Object, objectsWithRefs: Array<Object>, itemToBeDeletedId: any): Array<Object> {
  //   return objectsWithRefs.filter((item) => {
  //     const id = item.keyToFindAttributeValue;
  //     const ref = this.getRelationship(state, id);
  //
  //     return itemToBeDeletedId === ref.targetId;
  //   });
  // }

  _getDescendantsThatAreTargets(state: Object, node: Object): Array<Object> {
    const descendants = graphTraversal.traverseAndCollect(node, 'id');

    return this._getCentralizedRelationships(state).map((rel) => {
      return descendants.find((desc) => desc.id === rel.targetId);
    }).filter(Boolean);
  }

  _getDescendantsWithExternalSourceIds(state: Object, itemId: any): Array<DescendantRelationship> {
    const node = graphTraversal.find(state, itemId);
    if (!node) {
      throw new Error(`Could not find node ${itemId} while trying to get descendents with external source IDs.`);
    }

    const descendantTargets = this._getDescendantsThatAreTargets(state, node);

    const drArray: Array<DescendantRelationship> = this._getCentralizedRelationships(state).map((rel) => {
      const desc = descendantTargets.find((descTarget) => descTarget.id === rel.targetId);
      let result: DescendantRelationship = null;
      if (desc) {
        result = {
          relationship: rel,
          descendant: desc
        };
      } else {
        result = null;
      }
      return result;
    }).filter(Boolean);


    const sourceIds = graphTraversal.collectPropValuesByPropName(node, 'id');

    return drArray.filter((item) => !sourceIds.includes(item.relationship.sourceId));
  }

  createRelationship(state: Object, nodeSource: Object, sourceAttributeName: string, targetId: any) {
    const centralizedRels = this._getCentralizedRelationships(state);

    const sourceId = nodeSource.id;

    if (this._doesExist(state, sourceId, sourceAttributeName, targetId)) {
      throw new Error(`Could not create ref with {sourceId: ${sourceId}', sourceAttributeName: '${sourceAttributeName}', and targetId: ${targetId}} because it already exists.`);
    }

    const relationship = this._createInstance(state, sourceId, sourceAttributeName, targetId);

    centralizedRels.push(relationship);

    nodeSource[sourceAttributeName] = stateTraversal.createReference(relationship.id);

    return relationship;
  }

  getRelationship(state: Object, relationshipId: number): Relationship {
    return this._getCentralizedRelationships(state).find((item) => item.id === relationshipId);
  }

  deleteRelationshipByRelationshipId(state: Object, relationshipId: number) {
    const relationships = this._getCentralizedRelationships(state);
    const ndx = relationships.findIndex((item) => item.id === relationshipId);

    if (ndx < 0) throw new Error(`Encountered problem while trying to delete relationship that does not exist (id = ${relationshipId}`);

    return relationships.splice(ndx, 1)[0];
  }

  validateForDeletion(state: Object, nodeSource: Object, sourceAttributeName: string) {
    if (!nodeSource) {
      throw new Error(`Encountered problem while trying to delete relationship by source attribute. Could not find source object in state. (id == ${sourceId}`);
    }

    if (!(sourceAttributeName in nodeSource)) {
      throw new Error(`Encountered problem while trying to delete relationship by source attribute. Source object does not have attribute '${sourceAttributeName}'.`);
    }

    const ref = nodeSource[sourceAttributeName];

    if (!ref || !stateTraversal.isReference(ref)) {
      const errMessage = `Encountered problem while trying to delete relationship by source attribute. ' +
      'Source object attribute ${sourceAttributeName} does not have a valid reference attribute. Instead found ${JSON.stringify(ref)}`;
      throw new Error(errMessage);
    }
  }

  deleteRelationshipBySourceAttribute(state: Object, sourceId: string | number, sourceAttributeName: string) {
    const nodeSource = graphTraversal.find(state, sourceId);

    this.validateForDeletion(state, nodeSource, sourceAttributeName);

    const ref = nodeSource[sourceAttributeName];

    const referenceId = stateTraversal.extractRelationshipIdFromReference(ref);

    const relationships = this._getCentralizedRelationships(state);

    const ndx = relationships.findIndex((item) => item.id === referenceId);

    if (ndx < 0) throw new Error(`Encountered problem while trying to delete relationship by source attribute. Relationship with id ${referenceId} could not be found.`);

    nodeSource[sourceAttributeName] = null;

    return relationships.splice(ndx, 1)[0];
  }
}

export default new RelationshipUtils();

