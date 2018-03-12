import _ from 'lodash';

const originCoordinates = { x: 0, y: 0 };

class SvgModelFactoryHelper {
  mergeSvgAttributes(model) {
    const svgStuff = {
      zoom: 1,
      viewCoordinates: originCoordinates,
      viewCoordinatesDragOffset: originCoordinates
    };

    return { ...(_.cloneDeep(model)), ...svgStuff };
  }
}

export default new SvgModelFactoryHelper();
