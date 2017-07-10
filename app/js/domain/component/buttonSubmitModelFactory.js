import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class ButtonSubmitModelFactory extends ModelFactory {

  createInstance(parentId, elementId, label) {
    const id = f22Uuid.generate();

    return {
      parentId,
      id,
      typeLabel: ComponentTypes.ButtonSubmit,
      elementId,
      label,
      style: null
    };
  }
}

export default new ButtonSubmitModelFactory();
