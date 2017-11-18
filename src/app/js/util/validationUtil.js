import _ from 'lodash';

class ValidationUtil {

  isUnique(ancestorNode, currentOwningNode, propertyName, propertyValue) {

    const propValue = _.trim(propertyValue);

    let matchedModels = this.findPropInModel(ancestorNode, propertyName);

    matchedModels = _.filter(matchedModels, (item) => {
      return item.id !== currentOwningNode.id;
    });

    const values = matchedModels.map((item) => {
      return item[propertyName];
    });

    return !values.includes(propValue);
  }

  findPropInModel(model, propertyName) {
    let found = [];
    let result = [];
    if (propertyName in model) {
      result.push(model);
    }

    if ('children' in model && Array.isArray(model.children)) {
      found = this.findAll(propertyName, model.children);
      if (found.length > 0) {
        result = result.concat(found);
      }
    }

    return result;
  }

  findAll(propertyName, items) {
    let found = [];
    let result = [];

    for (let i = 0; i < items.length; i++) {
      found = this.findPropInModel(items[i], propertyName);
      if (found.length > 0) {
        result = result.concat(found);
      }
    }

    return result;
  }
}

export default new ValidationUtil();
