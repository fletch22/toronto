class Component {

  wrapType(typeLabel, object) {
    object.typeLabel = typeLabel;
    return object;
  }
};

export default Component;