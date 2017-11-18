import _ from 'lodash';

class ViewUtils {
  findFirst(viewType, state) {
    return _.find(state.views, (view) => {
      return view.viewType === viewType;
    });
  }

  findSingle(viewType, state) {
    const collection = _.filter(state.views, (view) => {
      return view.viewType === viewType;
    });

    if (collection.length > 1) {
      throw new Error('Encountered problem finding single view in system\'s view collection.');
    }

    return collection[0];
  }

  removeAllViewsByType(viewType, state) {
    const matches = _.filter(state.views, (view) => {
      return view.viewType !== viewType;
    });
    /* eslint-disable  no-param-reassign */
    state.views = matches;
  }
}

export default new ViewUtils();
