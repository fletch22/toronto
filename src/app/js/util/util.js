


class Util {

  doArrayElementsMatchIdentities(a, b) {
    let array1 = a;
    let array2 = b;

    if (!a) {
      array1 = [];
    }

    if (!b) {
      array2 = [];
    }

    if (array1.length !== array2.length) return false;

    for (let i = 0; i < array1.length; ++i) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  hashCode(str) {
    let hash = 0;
    let i;
    let chr;
    if (this.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}

export default new Util();
