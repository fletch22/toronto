import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import websiteContainerService from '../../../../service/component/websiteContainerService';
import graphTraversal from '../../../../state/graphTraversal';
import ViewModelCopyEditor from '../../ViewModelCopyEditor';
import TextInput from '../../../view/TextInput';

class EditWebsiteDetails extends ViewModelCopyEditor {

  render() {
    const modelIdDisplay = this.props.model.id || '-';
    return (
      <div>
        <div className="row">
          <div className="col-xs-2"><label>ID:</label></div>
          <div className="col-lg-10">{modelIdDisplay}</div>
        </div>
        <div className="row">
          <div className="col-xs-2"><label>Parent ID:</label></div>
          <div className="col-lg-10">{this.props.model.parentId}</div>
        </div>
        <div className="row">
          <div className="col-lg-2" style={{ margin: '4px 0 0 0' }}><label>Label:</label></div>
          <div className="col-lg-10"><TextInput id={this.props.id} path={'model.label'} value={this.props.label} /></div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div style={{ display: 'inline', float: 'right' }}>
              <button type="button" onClick={this.props.onSaveClick}>Save</button>
              <button type="button" onClick={this.props.onCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditWebsiteDetails.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.object,
  parentModelId: PropTypes.number,
  modelNodeId: PropTypes.any,
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  cleanUp: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const view = graphTraversal.find(state, ownProps.id);

  return {
    label: view.model.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    ViewModelCopyEditor.createUpdate(dispatch, ownProps, websiteContainerService.createOrUpdate);
  }
});

EditWebsiteDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditWebsiteDetails);

export default EditWebsiteDetails;
