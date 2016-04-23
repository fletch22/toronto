import ComponentTypes from './componentTypes';
import Component from './component';

class AppContainerFactory extends Component {

  createInstance(label) {
    if (label === null
    || label === 'undefined'
    || label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    return this.wrapType(ComponentTypes.AppContainer, { label });
  }
}

export default new AppContainerFactory();