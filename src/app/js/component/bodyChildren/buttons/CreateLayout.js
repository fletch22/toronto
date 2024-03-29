import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import modelGenerator from '../../../domain/component/modelGenerator';

class ButtonCreateLayout extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-object-group" onClick={this.props.createLayout} tooltipText="Create Layout" />
      </div>
    );
  }
}

ButtonCreateLayout.propTypes = {
  viewModel: PropTypes.object,
  createLayout: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayout: () => {
      const model = modelGenerator.generate(ownProps.viewModel.viewModel.id, ComponentTypes.Layout);
      bodyChildrenCreatorService.create(dispatch, model, ownProps.viewModel.id);
    }
  };
};


ButtonCreateLayout = connect(
  null,
  mapDispatchToProps
)(ButtonCreateLayout);

export default ButtonCreateLayout;
