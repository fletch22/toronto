
class Util {

  getOptionalLiteral(value) {
    return {
      isPresent: !!value,
      value
    };
  }

  convertOptionalForResponse(optional) {
    let value = null;
    if (optional.isPresent()) {
      value = optional.get();
    }
    return this.getOptionalLiteral(value);
  }
}

export default new Util();
