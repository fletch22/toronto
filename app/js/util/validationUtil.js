import _ from 'lodash';

class ValidationUtil {

  isUnique(ancestorNode, currentOwningNode, propertyName, propertyValue) {

    const propValue = _.trim(propertyValue);

    const matchedModels = this.findPropInModel(ancestorNode, propertyName);

    let values = matchedModels.map((item) => {
      return item[propertyName];
    });

    values = _.filter(values, (item) => {
      return item.id !== currentOwningNode.id;
    });

    return !values.includes(propValue);
  }

  findPropInModel(model, propertyName) {
    let found = [];
    let result = [];
    if (propertyName in model) {
      result.push(model);
    }

    if ('children' in model && _.isArray(model.children)) {
      found = this.findAll(propertyName, model.children);
      if (found.length) {
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
      if (found.length) {
        result = result.concat(found);
      }
    }

    return result;
  }
}

export default new ValidationUtil();
