import _ from 'lodash';
import styleTranslator from '../domain/component/style/StyleTranslator';

class ActionBodyChildSetPropertyHandler {

  setStyleOnAllChildren(viewModel, styleName, styleValue) {
    const children = viewModel.viewModel.children;
    children.forEach((child, index) => {
      const childNew = Object.assign({}, child);
      this.setStyle(childNew.viewModel, styleName, styleValue);
      children.splice(index, 1, childNew);
    });
  }

  setStyle(vm, styleName, styleValue) {
    const jsonStyle = vm.style;
    /* eslint-disable no-param-reassign */
    vm.style = styleTranslator.setStyleAttribute(jsonStyle, styleName, styleValue);
  }
}

export default new ActionBodyChildSetPropertyHandler();
