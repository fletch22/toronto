
class BorderScrivenerUtils {

  constructor() {
    this.getBoundingClientRect = this.getBoundingClientRect.bind(this);
  }

  getBoundingClientRect(selectedElementId) {
    let result = null;

    const element = window.document.getElementById(selectedElementId);
    if (!!element) {
      const rectRaw = element.getBoundingClientRect();

      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      result = {
        left: parseInt(rectRaw.left, 10) + scrollLeft,
        top: parseInt(rectRaw.top, 10) + scrollTop,
        width: parseInt(rectRaw.width, 10),
        height: parseInt(rectRaw.height, 10)
      };
    }

    return result;
  }

  domActionSyncer(state) {
    const borderScrivener = state.borderScrivener;

    if (borderScrivener.selectedElementId) {
      const rectCurrent = this.getBoundingClientRect(borderScrivener.selectedElementId);
      if (rectCurrent) {
        if (rectCurrent.top !== borderScrivener.top
          || rectCurrent.left !== borderScrivener.left
          || rectCurrent.width !== borderScrivener.width
          || rectCurrent.height !== borderScrivener.height) {
          /* eslint-disable no-param-reassign */
          Object.assign(borderScrivener, rectCurrent);
          borderScrivener.visible = true;
        }
      } else {
        borderScrivener.visible = false;
      }
    } else {
      borderScrivener.visible = false;
    }

    return state;
  }

  clearBorderScrivener(state) {
    const borderScrivener = state.borderScrivener;

    for (const x in borderScrivener) {
      if (borderScrivener.hasOwnProperty(x)) {
        borderScrivener[x] = null;
      }
    }
  }

  isSelected(state, id) {
    return state.borderScrivener.selectedElementId === id;
  }
}

export default new BorderScrivenerUtils();
