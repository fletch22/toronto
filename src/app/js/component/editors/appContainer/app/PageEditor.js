import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Body from '../../../../component/bodyChildren/body/Body';
import borderScrivenerUtils from '../../../utils/borderScrivenerUtils';

class PageEditor extends React.Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Body { ...this.props.viewModel }
          selectedChildViewId={this.props.selectedChildViewId}
          canBeDroppedOn
          isSelected={this.props.isBodySelected}
          children={this.props.viewModel.viewModel.children}
          isHoveringOver={this.props.isHoveringOver}
          viewModel={this.props.viewModel}
        />
      </div>
    );
  }
}

PageEditor.propTypes = {
  id: PropTypes.string,
  viewModel: PropTypes.object,
  selectedChildViewId: PropTypes.string,
  isBodySelected: PropTypes.bool,
  isHoveringOver: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    selectedChildViewId: ownProps.viewModel.selectedChildViewId,
    viewModel: ownProps.viewModel,
    isBodySelected: borderScrivenerUtils.isSelected(state, ownProps.id),
    isHoveringOver: ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId
  };
};

PageEditor = connect(
  mapStateToProps,
  null
)(PageEditor);

export default PageEditor;
