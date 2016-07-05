

class OrbModelTraversal {

  // Called with every property and it's value
  process(key, value, id) {
    let found = false;
    if (key === 'id'
      && value === id) {
      found = true;
    }
    return found;
  }

  traverseIt(o, func, id) {
    let foundObject = undefined;
    for (const i in o) {
      const found = func.apply(this, [i, o[i], id]);
      if (found) {
        foundObject = o;
        break;
      } else {
        if (o[i] !== null && typeof(o[i]) === 'object') {
          // Going on step down in the object tree!!
          foundObject = this.traverseIt(o[i], func, id);
          if (foundObject !== undefined) {
            break;
          }
        }
      }
    }
    return foundObject;
  }

  find(state, id) {
    return this.traverseIt(state, this.process, id);
  }

  findParent(state, id) {
    let parent;
    const child = this.find(state, id);
    if (child) {
      parent = this.find(state, child.parentId);
    }
    return parent;
  }
}

export default new OrbModelTraversal();
