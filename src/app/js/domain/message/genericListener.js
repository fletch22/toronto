class GenericListener {

  constructor() {
    this.TYPE = 'message';
    this.callback = null;
  }

  register(callback) {
    this.callback = callback;
    window.addEventListener(this.TYPE, callback, false);
  }

  unregister() {
    window.removeEventListener(this.TYPE, this.callback, false);
  }
}

export default GenericListener;
