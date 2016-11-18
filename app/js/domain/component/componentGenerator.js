import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import domFactory from './domFactory';

class ComponentGenerator {

  createApp(parentId, childLabel, childId) {
    const modelChild = appModelFactory.createInstance(parentId, childLabel, childId);
    return {
      model: modelChild,
      dom: domFactory.createApp(modelChild)
    };
  }

  createWebsite(parentId, childLabel, childId) {
    const modelChild = websiteModelFactory.createInstance(parentId, childLabel, childId);
    return {
      model: modelChild,
      dom: domFactory.createWebsite(modelChild)
    };
  }
}

export default new ComponentGenerator();
