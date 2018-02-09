

class ObjectUtil {
  getPropertyKeys(object) {
    const collection = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        collection.push(key);
      }
    }
    return collection;
  }
}

export default new ObjectUtil();
