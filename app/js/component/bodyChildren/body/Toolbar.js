import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import viewModelCreator from '../../utils/viewModelCreator';
import modelGenerator from '../../../domain/component/modelGenerator';
import layoutModelFactory from '../../../domain/component/layoutModelFactory';
import actionComponentCreatorHandler from '../../../reducers/actionComponentCreatorHandler';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import bodyChildrenCreator from '../../../component/editors/bodyChildren/bodyChildrenCreator';

class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-object-group" onClick={this.props.createLayout} tooltipText="Create Layout" />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  createLayout: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayout: () => {
      const model = modelGenerator.generate(ownProps.selectedChildModelId, ComponentTypes.Layout);
      viewModelCreator.create(dispatch, model, ownProps.selectedChildViewId);
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;
