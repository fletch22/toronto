export const ActionTypes = {
  CONFIGURE_DDL: {
    SELECT_COLLECTION: {
      TOGGLE_NEW_COLLECTION_NAME_INPUT: 'WIZ_CFGDDL_SEL_COLL_TOGGLE_NEW_COLLECTION_NAME_INPUT'
    }
  }
};

export const actionToggleNewCollectionNameInput = (uuid) => ({
  type: ActionTypes.CONFIGURE_DDL.SELECT_COLLECTION.TOGGLE_NEW_COLLECTION_NAME_INPUT,
  payload: {
    uuid
  }
});
