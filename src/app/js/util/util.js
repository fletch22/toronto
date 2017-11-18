

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
}

export default new Util();
