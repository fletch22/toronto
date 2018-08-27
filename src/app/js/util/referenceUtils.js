// @flow
import graphTraversal from 'common/state/graphTraversal';
import {ObjectWithAttributeObjectKeyDescriptor} from '../../../common/state/graphTraversal';

export const REF_ID_ATTRIBUTE = '$ref';

export type Reference = {
  $ref: {
    targetId: string | number,
    modifierClause: string
  }
}
export type ReferenceDescriptor = {
  arrowId: any,
  arrowAttributeName: String,
  reference: Reference
}

export type DependencyCollection = {
  dependeeId: any,
  dependencies: Array<DependencyDescription>
};

export type DependencyDescription = {
  dependentId: any,
  modifierClause: String,
  dependencyCollection: DependencyCollection
}

export type ReferenceValidationResult = {
  targetNode: Object,
  willBeValidReference: Boolean
}

class ReferenceUtils {
  _createRawReference(targetId: string, modifierClause: String): Reference {
    return {
      $ref: {
        targetId,
        modifierClause
      }
    };
  }

  willBeValidReference(state: Object, targetId: string | number, arrowNode: Object): ReferenceValidationResult {
    const targetNode = graphTraversal.find(state, targetId);
    const dc = this.getDependencyCollection(state, targetNode);
    const dcDepIds: Array<String | number> = this.collectAllDependentIds(dc);

    return {
      targetNode,
      willBeValidReference: !dcDepIds.includes(arrowNode.id)
    };
  }

  createReference(state: Object, arrowNode: Object, arrowAttributeName: string, targetId: string, modifierClause: String): Reference {
    const refValidResult = this.willBeValidReference(state, targetId, arrowNode);

    if (!refValidResult.willBeValidReference) {
      const targetNode = refValidResult.targetNode;
      throw new Error('Encountered problem while trying to create reference. The operation would have created a circular reference. ' +
        `Object ${targetNode.id} (${targetNode.typeLabel}) is a already a dependee of object ${arrowNode.id} (${arrowNode.typeLabel}).`);
    }

    arrowNode[arrowAttributeName] = this._createRawReference(targetId, modifierClause);

    return arrowNode[arrowAttributeName];
  }

  collectAllDependentIds(dependencyCollection: DependencyCollection): Array<string | number> {
    return dependencyCollection.dependencies.flatMap(depDescr => {
      const depId = depDescr.dependentId;
      return this.collectAllDependentIds(depDescr.dependencyCollection).concat(depId);
    });
  }

  getAllReferences(node: Object): Array<ReferenceDescriptor> {
    const keyDescriptors: Array<ObjectWithAttributeObjectKeyDescriptor> = graphTraversal.findDescendantsWithAttributeObjectKey(node, '$ref');

    return keyDescriptors.map((desc) => ({
      arrowId: desc.id,
      arrowAttribute: desc.attributeName,
      reference: {
        $ref: desc.keyToFindAttributeValue
      }
    }));
  }

  getDependencies(state: Object, refDescriptors: Array<ReferenceDescriptor>): Array<DependencyDescription> {
    return refDescriptors.map(refD => {
      const node = graphTraversal.find(state, refD.arrowId);
      return {
        dependentId: refD.arrowId,
        modifierClause: refD.reference.$ref.modifierClause,
        dependencyCollection: this.getDependencyCollection(state, node)
      };
    });
  }

  getDependencyCollection(state: Object, node: Object): DependencyCollection {
    const refDescriptors: Array<ReferenceDescriptor> = this.getAllReferences(state);
    const targetRefDescriptors = refDescriptors.filter((refD) => refD.reference.$ref.targetId === node.id);

    return {
      dependeeId: node.id,
      dependencies: this.getDependencies(state, targetRefDescriptors)
    };
  }

  isDeleteOk(node: Object) {
    return !this.doesNodeHaveExternalDependencies(node);
  }

  doesNodeHaveExternalDependencies(node: Object) {
    const refs = this.getAllReferences(node);
    const refIds = refs.map((ref) => ref.arrowId);
    const ids = graphTraversal.collectPropValuesByPropName(node, 'id');

    return refIds.filter(e => !ids.includes(e)).length > 0;
  }

  resolveReference(reference: Reference): string | any {
    return reference.$ref.targetId;
  }

  getDependencyStory(dependencyCollection: DependencyCollection) {
    // Not yet implemented.
    return null;
  }
}

export default new ReferenceUtils();

