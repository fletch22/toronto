import { actionInvokeProxy } from './proxy/index';

class ActionProxy {
  constructor() {
    this.actions = {};
  }

  register(key, fn) {
    this.actions[key] = fn;
  }

  invoke(dispatch, key, args) {
    this.validateKey(key);
    dispatch(actionInvokeProxy(key, args));
  }

  validateKey(key) {
    if (key in this.actions === false) {
      throw new Error(`Could not execute action because action '${key}' could not be found.`);
    }
  }

  execute(actionStatePackage, key, args) {
    this.validateKey(key);
    return this.actions[key](actionStatePackage, args);
  }
}

export default new ActionProxy();
