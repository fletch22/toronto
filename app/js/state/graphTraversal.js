
class GraphTraversal {

  findParent(node, id) {
    let parent;
    const child = this.find(node, id, 'id');
    if (child) {
      parent = this.find(node, child.parentId, 'id');
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

  find(node, propertyValue) {
    return this.traverseIt(node, propertyValue, 'id');
  }
}

export default new GraphTraversal();
