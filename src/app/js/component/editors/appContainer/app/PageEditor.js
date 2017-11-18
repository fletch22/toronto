import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import MetaData from '../../../dashboard/app/website/page/MetaData';
import graphTraversal from '../../../../state/graphTraversal';
import { actionUpdateViewPropertyValue } from '../../../../actions/index';
import Body from '../../../../component/bodyChildren/body/Body';
import borderScrivenerUtils from "../../../utils/borderScrivenerUtils";

class PageEditor extends React.Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Body { ... this.props.viewModel }
          selectedChildViewId={this.props.selectedChildViewId}
          canBeDroppedOn
          isSelected={this.props.isBodySelected}
          children={this.props.viewModel.viewModel.children}
          isHoveringOver={this.props.isHoveringOver}
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
