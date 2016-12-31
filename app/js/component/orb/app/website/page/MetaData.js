import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import graphTraversal from '../../../../../state/graphTraversal';
import TextInput from '../../../../view/TextInput';
import EditorIdDisplay from '../../EditorIdDisplay';
import EditorButtons from '../../EditorButtons';
import containerService from '../../../../../service/component/containerService';
import ViewModelCopyEditor from '../../../ViewModelCopyEditor';

class MetaData extends ViewModelCopyEditor {
  render() {
    return (
      <div className="tab-content">
        <EditorIdDisplay model={this.props.model} />
        <div className="row">
          <div className="col-lg-2 editor-label-container"><label>Page Name:</label></div>
          <div className="col-lg-10">
            <TextInput id={this.props.id} path={'model.pageName'} value={this.props.pageName} />
          </div>
        </div>
        <EditorButtons onSaveClick={this.props.onSaveClick} onCancelClick={this.props.onCancelClick} />
      </div>
    );
  }
}

MetaData.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  pageName: PropTypes.string, // NOTE: Label attribute on object.
  model: PropTypes.object, // NOTE: Model object carrying attribute values
  parentModelId: PropTypes.number, // NOTE: Parent to model object.
  modelNodeId: PropTypes.any, // NOTE: Model ID - if new this value will be a UUID.
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const view = graphTraversal.find(state, ownProps.id);

  return {
    pageName: view.model.pageName
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    ViewModelCopyEditor.createUpdate(dispatch, ownProps, containerService.createOrUpdate);
  }
});

MetaData = connect(
  mapStateToProps,
  mapDispatchToProps
)(MetaData);


export default MetaData;
