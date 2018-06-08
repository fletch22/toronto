import React, { PropTypes } from 'react';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import DnDataStore from '../../../component/editors/dataNarrative/DnDataStore';
import DnBrowser from '../../../component/editors/dataNarrative/DnBrowser';
import DnWebServer from '../../../component/editors/dataNarrative/DnWebServer';
import DnConnector from './dnConnector/DnConnector';
import DnConnectorInNexus from './DnConnectorInNexus';
import DnConnectorOutNexus from './DnConnectorOutNexus';
import DnTransferCase from './DnTransferCase';
import DnTransferCaseMapper from './dnEditorTransferCase/DnTransferCaseMapper';

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
        component = (<DnConnector id={componentData.id} parentId={componentData.parentId} viewModel={componentData.viewModel} data={componentData} dataNarrativeView={this.props.dataNarrativeView} />);
        break;
      }
      case ComponentTypes.DnConnectorInNexus: {
        component = (<DnConnectorInNexus {... this.props} data={this.props} />);
        break;
      }
      case ComponentTypes.DnConnectorOutNexus: {
        component = (<DnConnectorOutNexus data={this.props.data} />);
        break;
      }
      case ComponentTypes.DnTransferCase: {
        component = (<DnTransferCase data={this.props.data} />);
        break;
      }
      case ComponentTypes.DnTransferCaseMapper: {
        component = (<DnTransferCaseMapper data={this.props.data} />);
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
