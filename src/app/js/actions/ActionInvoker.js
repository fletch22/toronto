import { actionInvokeProxy } from './proxy/index';
import { SHA256 as sha256 } from 'crypto-js';

class ActionInvoker {

  constructor() {
    this.fn = {};
  }

  invoke(dispatch, fn, args) {
    const hash = sha256(fn.toString());
    this.fn[hash] = fn;

    dispatch(actionInvokeProxy(hash, args));
  }

  execute(actionStatePackage, fnHash, args) {
    return this.fn[fnHash](actionStatePackage, args);
  }
}

export default new ActionInvoker();
