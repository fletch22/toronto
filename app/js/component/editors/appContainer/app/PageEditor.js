import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import MetaData from '../../../dashboard/app/website/page/MetaData';
import graphTraversal from '../../../../state/graphTraversal';
import { actionUpdateViewPropertyValue } from '../../../../actions/index';
import Body from '../../../../component/bodyChildren/body/Body';

class PageEditor extends React.Component {
  render() {
    return (
      <div>
        <Tabs activeKey={this.props.activeTab} onSelect={this.props.handleSelect} id="controlled-tab-example">
          <Tab eventKey={1} title="Metadata">
            <MetaData { ... this.props } />
          </Tab>
          <Tab eventKey={2} title="Page Body" disabled={this.props.tabBodyDisabled}><Body { ... this.props.viewModel } /></Tab>
        </Tabs>
      </div>
    );
  }
}

PageEditor.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  model: PropTypes.object,
  viewModel: PropTypes.object,
  modelNodeId: PropTypes.any,
  activeTab: PropTypes.number,
  handleSelect: PropTypes.func,
  tabBodyDisabled: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const viewContainer = state.dom;
  const object = graphTraversal.find(viewContainer, ownProps.id);

  const activeTab = (_.has(object, 'activeTab')) ? object.activeTab : 1;
  const tabBodyDisabled = !_.has(ownProps, 'modelNodeId');

  return {
    activeTab,
    tabBodyDisabled
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSelect: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, 'activeTab', event, true));
    }
  };
};

PageEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageEditor);

export default PageEditor;
