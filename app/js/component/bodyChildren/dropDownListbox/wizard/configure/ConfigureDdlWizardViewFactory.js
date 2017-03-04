import f22Uuid from '../../../../../util/f22Uuid';
import PseudoModalTypes from '../../../../../component/modals/PseudoModalTypes';

class ConfigureDdlWizardViewFactory {
  createInstance(ddlModel, datastores) {
    return {
      id: f22Uuid.generate(),
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      datastores,
      activeIndex: 0,
      views: {
        selectCollection: {

        }
      }
    };
  }
}

export default new ConfigureDdlWizardViewFactory();

