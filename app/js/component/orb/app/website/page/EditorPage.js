import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import MetaData from './MetaData';
import graphTraversal from '../../../../../state/graphTraversal';
import { actionUpdateViewPropertyValue } from '../../../../../actions/index';

class EditorPage extends React.Component {

  render() {
    return (
      <div>
        <Tabs activeKey={this.props.activeTab} onSelect={this.props.handleSelect} id="controlled-tab-example">
          <Tab eventKey={1} title="Metadata">
            <MetaData { ... this.props } />
          </Tab>
          <Tab eventKey={2} title="Page Body">Tab 2 content</Tab>
        </Tabs>
      </div>
    );
  }
}

EditorPage.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  activeTab: PropTypes.number,
  handleSelect: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const viewContainer = state.dom;
  const object = graphTraversal.find(viewContainer, ownProps.id);

  const activeTab = (_.has(object, 'activeTab')) ? object.activeTab : 1;

  return {
    activeTab
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSelect: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, 'activeTab', event, true));
    }
  };
};

EditorPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorPage);

export default EditorPage;
