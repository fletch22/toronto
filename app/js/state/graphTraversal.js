import ComponentTypes from '../domain/component/ComponentTypes';

class GraphTraversal {

  findParent(node, id) {
    let parent;
    const child = this.find(node, id);
    if (child) {
      parent = this.find(node, child.parentId);
    }
    return parent;
  }

  // Called with every property and it's value
  process(key, value, propertyValue, propertyName) {
    let found = false;
    if (key === propertyName
      && value === propertyValue) {
      found = true;
    }
    return found;
  }

  traverseIt(o, propertyValue, propertyName) {
    let foundObject = undefined;
    for (const i in o) {
      // const found = func.apply(this, [i, o[i], id]);
      const found = this.process(i, o[i], propertyValue, propertyName);
      if (found) {
        foundObject = o;
        break;
      } else {
        if (o[i] !== null && typeof(o[i]) === 'object') {
          // Going on step down in the object tree!!
          foundObject = this.traverseIt(o[i], propertyValue, propertyName);
          if (foundObject !== undefined) {
            break;
          }
        }
      }
    }
    return foundObject;
  }

  traverseAndCollect(o, propertyName) {
    let foundObjects = [];

    for (const key in o) {
      const found = o[key].hasOwnProperty(propertyName);
      if (found) {
        foundObjects.push(o);
      } else {
        if (o[key] !== null && typeof(o[key]) === 'object') {
          const foundObjectsFromChildren = this.traverseAndCollect(o[key], propertyName);
          foundObjects = foundObjects.concat(foundObjectsFromChildren);
        }
      }
    }
    return foundObjects;
  }

  find(node, propertyValue) {
    return this.traverseIt(node, propertyValue, 'id');
  }

  collectPropValuesByPropName(node, propertyName) {
    const collectedMatches = this.traverseAndCollect(node, propertyName);

    return collectedMatches.map((item) => (item[propertyName]));
  }

  findAncestorByTypeLabel(rootishNode, node, typeLabel) {
    if (node.hasOwnProperty('typeLabel') && node.typeLabel === typeLabel) {
      return node;
    } else {
      if (node.hasOwnProperty('parentId')) {
        const parentNode = this.find(rootishNode, node.parentId);
        if (parentNode !== rootishNode) {
          return this.findAncestorByTypeLabel(rootishNode, parentNode, typeLabel);
        } else {
          throw new Error(`Encountered problem trying to find ancestor \'${typeLabel}\' in ${JSON.stringify(node)}. Traversed to root but could not find parent.`);
        }
      } else {
        throw new Error(`Encountered problem trying to find ancestor \'${typeLabel}\' in ${JSON.stringify(node)}`);
      }
    }
  }
}

export default new GraphTraversal();
