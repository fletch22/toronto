import _ from 'lodash';
import { ACTIONS as APP_ACTIONS } from './app';

export const ActionTypes = {
  DASHBOARD: {}
};

ActionTypes.DASHBOARD.APP = {};
_.extend(ActionTypes.DASHBOARD.APP, APP_ACTIONS);

export default {
  ActionTypes
};

