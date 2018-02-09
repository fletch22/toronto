

class Util {

  constructor() {
    this.times = this.times.bind(this);
  }

  times(x) {
    return (f) => {
      if (x > 0) {
        f(x);
        this.times(x - 1)(f);
      }
    };
  }
}

export default new Util();
