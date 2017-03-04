import _ from 'lodash';
import ComponentTypes from '../../domain/component/ComponentTypes';
import WizardTypes from '../../component/wizards/WizardTypes';

const pseudoModalTypes = {
  ComponentTypes: {
    App: ComponentTypes.App,
    WebFolder: ComponentTypes.WebFolder,
    WebPage: ComponentTypes.WebPage
  },
  WizardTypes
};

export default pseudoModalTypes;
