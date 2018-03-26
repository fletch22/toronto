import React, { PropTypes } from 'react';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import DnDataStore from '../../../component/editors/dataNarrative/DnDataStore';
import DnBrowser from '../../../component/editors/dataNarrative/DnBrowser';
import DnWebServer from '../../../component/editors/dataNarrative/DnWebServer';
import DnConnector from '../../../component/editors/dataNarrative/DnConnector';

class DnComponentDealer extends React.Component {

  render() {
    const componentData = this.props.data;

    let component = null;

    switch (componentData.viewModel.typeLabel) {
      case ComponentTypes.DnBrowser: {
        component = (<DnBrowser {... componentData} data={componentData} dataNarrativeView={this.props.dataNarrativeView} />);
        break;
      }
      case ComponentTypes.DnDataStore: {
        component = (<DnDataStore {... componentData} data={componentData} dataNarrativeView={this.props.dataNarrativeView} />);
        break;
      }
      case ComponentTypes.DnWebServer: {
        component = (<DnWebServer {... componentData} data={componentData} dataNarrativeView={this.props.dataNarrativeView} />);
        break;
      }
      case ComponentTypes.DnConnector: {
        component = (<DnConnector {... componentData} data={componentData} dataNarrativeView={this.props.dataNarrativeView} />);
        break;
      }
      default:
        throw new Error(`Encountered error trying to create data narrative component. Did not recognize ${this.props}.`);
    }

    return (
      component
    );
  }
}


DnComponentDealer.propTypes = {
  data: PropTypes.object,
  dataNarrativeView: PropTypes.object
};

export default DnComponentDealer;
