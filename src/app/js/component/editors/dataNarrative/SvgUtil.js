

class SvgUtil {
  static translateRelativeToNode(nodeNeedingMap, nodeToMapFrom) {
    const inNexusRect = nodeNeedingMap.getBoundingClientRect();

    const mySVG = document.getElementById('svgRoot');
    const pnt = mySVG.createSVGPoint();
    pnt.x = inNexusRect.x;
    pnt.y = inNexusRect.y;

    const SCTM = nodeToMapFrom.getScreenCTM();
    return pnt.matrixTransform(SCTM.inverse());
  }
}

export default SvgUtil;
