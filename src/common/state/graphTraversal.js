// @flow
import _ from 'lodash';

export type ObjectWithAttributeObjectKeyDescriptor = {
  id: string,
  attributeName: string,
  keyToFindAttributeValue: any
};

class GraphTraversal {

  findParent(node: Object, id: string): ?Object {
    let parent;
    const child = this.find(node, id);
    if (child) {
      parent = this.find(node, child.parentId);
    }
    return parent;
  }

  findGrandParent(node: Object, id: string) {
    const parent = this.findParent(node, id);
    return (parent) ? this.findParent(node, parent.parentId) : undefined;
  }

  // Called with every property and it's value
  process(key: string, value: any, propertyValue: string, propertyName: string) {
    let found = false;
    if (key === propertyName
      && value === propertyValue) {
      found = true;
    }
    return found;
  }

  traverseIt(o: Object, propertyValue: string, propertyName: string): ?Object {
    let foundObject = null;
    for (const i in o) {
      // const found = func.apply(this, [i, o[i], id]);
      const found = this.process(i, o[i], propertyValue, propertyName);
      if (!!found) {
        foundObject = o;
        break;
      } else {
        if (o[i] !== null && typeof(o[i]) === 'object') {
          // Going on step down in the object tree!!
          foundObject = this.traverseIt(o[i], propertyValue, propertyName);
          if (!!foundObject) {
            break;
          }
        }
      }
    }
    return foundObject;
  }

  traverseAndCollect(o: Object, propertyName: string) {
    let foundObjects = [];

    if (o.hasOwnProperty(propertyName)) {
      foundObjects.push(o);
    }

    const gatherByTraverse = (item) => {
      const foundObjectsFromChildren = this.traverseAndCollect(item, propertyName);
      foundObjects = foundObjects.concat(foundObjectsFromChildren);
    };

    for (const key in o) {
      if (!!o[key]) {
        if (typeof o[key] === 'object') {
          if (Array.isArray(o[key])) {
            o[key].forEach(gatherByTraverse);
          } else {
            const foundObjectsFromChildren = this.traverseAndCollect(o[key], propertyName);
            foundObjects = foundObjects.concat(foundObjectsFromChildren);
          }
        }
      }
    }
    return foundObjects;
  }

  findByPropNameAndValue(o: Object, propertyName: string, value: string): Array<Object> {
    const collection = this.traverseAndCollect(o, propertyName);
    return collection.filter((item) => item[propertyName] === value);
  }

  find(node: Object, propertyValue: string) {
    return this.traverseIt(node, propertyValue, 'id');
  }

  collectPropValuesByPropName(node: Object, propertyName: string): Array<Object> {
    const collectedMatches = this.traverseAndCollect(node, propertyName);
    return collectedMatches.map((item) => item[propertyName]);
  }

  findAncestorByTypeLabel(rootishNode: Object, node: Object, typeLabel: string) {
    const result = this.findAncestorByTypeLabelWithNull(rootishNode, node, typeLabel);

    if (!result) {
      throw new Error(`Encountered problem trying to find ancestor \'${typeLabel}\' in ${JSON.stringify(node)}`);
    }
    return result;
  }

  findAncestorByTypeLabelWithNull(rootishNode: Object, node: Object, typeLabel: string) {
    if (node.hasOwnProperty('typeLabel') && node.typeLabel === typeLabel) {
      return node;
    } else {
      if (node.hasOwnProperty('parentId')) {
        const parentNode = this.find(rootishNode, node.parentId);
        if (parentNode && parentNode !== rootishNode) {
          return this.findAncestorByTypeLabelWithNull(rootishNode, parentNode, typeLabel);
        }
      }
      return null;
    }
  }

  getChildsIndex(array: Array<Object>, id: string) {
    if (!Array.isArray(array)) {
      throw new Error('Encountered error while trying to get child\'s index. Passed object is not array.');
    }
    return _.findIndex(array, (child) => child.id === id);
  }

  findAllAttributeValuesFromDescendentsWithAttribute(node: Object, attributeName: string) {
    let accumulator = [];

    for (const key of Object.keys(node)) {
      const attributeValue = node[key];
      if (attributeName === key) {
        accumulator.push(_.cloneDeep(attributeValue));
      }

      if (Array.isArray(attributeValue)) {
        for (const attrItem of attributeValue) {
          if (typeof attrItem === 'object') {
            const result = this.findAllAttributeValuesFromDescendentsWithAttribute(attrItem, attributeName);
            accumulator = accumulator.concat(result);
          }
        }
      } else if (typeof attributeValue === 'object') {
        const result = this.findAllAttributeValuesFromDescendentsWithAttribute(attributeValue, attributeName);
        accumulator = accumulator.concat(result);
      }
    }
    return accumulator;
  }

  findDescendantsWithAttributeObjectKey(node: Object, keyToFind: string): Array<ObjectWithAttributeObjectKeyDescriptor> {
    let accumulator = [];

    for (const key of Object.keys(node)) {
      const attributeValue = node[key];

      if (!!attributeValue) {
        if (Array.isArray(attributeValue)) {
          for (const attrItem of attributeValue) {
            if (typeof attrItem === 'object') {
              const result = this.findDescendantsWithAttributeObjectKey(attrItem, keyToFind);
              accumulator = accumulator.concat(result);
            }
          }
        } else if (typeof attributeValue === 'object') {
          if (Object.keys(attributeValue).includes(keyToFind)) {
            const result = {
              id: node.id,
              attributeName: key,
              keyToFindAttributeValue: _.cloneDeep(attributeValue[keyToFind])
            };
            accumulator.push(result);
          }
          const result = this.findDescendantsWithAttributeObjectKey(attributeValue, keyToFind);
          accumulator = accumulator.concat(result);
        }
      }
    }
    return accumulator;
  }
}

export default new GraphTraversal();
