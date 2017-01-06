import _ from 'lodash';
import { ACTIONS as APP_ACTIONS } from './app';
import { ACTIONS as ROOT_ACTIONS } from './bodyChildren/root';

export const ActionTypes = {
  DASHBOARD: {}
};

ActionTypes.DASHBOARD.APP = {};
_.extend(ActionTypes.DASHBOARD.APP, APP_ACTIONS);
ActionTypes.DASHBOARD.BODY_CHILDREN = {};
_.extend(ActionTypes.DASHBOARD.BODY_CHILDREN, ROOT_ACTIONS);

export default {
  ActionTypes
};

