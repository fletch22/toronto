import appModelFactory from './appModelFactory';
import domFactory from './domFactory';

class ComponentGenerator {

  createApp(parentId, childLabel, childId) {
    const modelChild = appModelFactory.createInstance(parentId, childLabel, childId);
    return {
      model: modelChild,
      dom: domFactory.createApp(modelChild)
    };
  }
}

export default new ComponentGenerator();
