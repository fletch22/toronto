import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import WizardTypes from '../../component/wizards/WizardTypes';

const pseudoModalTypes = {
  ComponentTypes: {
    App: ComponentTypes.App,
    WebFolder: ComponentTypes.WebFolder,
    WebPage: ComponentTypes.WebPage,
    Website: ComponentTypes.Website
  },
  WizardTypes,
  DataNarrativeEditor: 'DataNarrativeEditor'
};

export default pseudoModalTypes;
