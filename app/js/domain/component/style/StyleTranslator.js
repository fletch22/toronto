import _ from 'lodash';

class StyleTranslator {
  setStyleAttribute(jsonStyle, name, value) {
    let style = {};
    if (jsonStyle) {
      style = JSON.parse(jsonStyle);
    }

    const newValue = _.trim(value);
    if (newValue === '') {
      delete style[name];
    } else {
      style[name] = newValue;
    }

    return JSON.stringify(style);
  }
}

export default new StyleTranslator();
