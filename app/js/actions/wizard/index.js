export const ActionTypes = {
  WIZARD: {
    SLIDE_RIGHT: 'SLIDE_RIGHT',
    SLIDE_LEFT: 'SLIDE_LEFT',
    SLIDE_TO_INDEX: 'SLIDE_TO_INDEX'
  }
};

export const actionCarouselSlideRight = (id) => ({
  type: ActionTypes.WIZARD.SLIDE_RIGHT,
  payload: {
    id
  }
});

export const actionCarouselSlideLeft = (id) => ({
  type: ActionTypes.WIZARD.SLIDE_LEFT,
  payload: {
    id
  }
});

export const actionCarouselSlideToIndex = (id, activeIndex) => ({
  type: ActionTypes.WIZARD.SLIDE_TO_INDEX,
  payload: {
    id,
    activeIndex
  }
});
