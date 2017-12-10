
class Util {

  getOptionalLiteral(value) {
    return {
      isPresent: !!value,
      value: value
    };
  }
}

export default new Util();
