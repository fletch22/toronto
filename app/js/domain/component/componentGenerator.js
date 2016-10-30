import appModelFactory from './appModelFactory';
import domFactory from './domFactory';

class ComponentGenerator {

  createApp(parentId, childLabel) {
    const modelChild = appModelFactory.createInstance(parentId, childLabel);
    return {
      model: modelChild,
      dom: domFactory.createApp(modelChild)
    };
  }
}

export default new ComponentGenerator();
