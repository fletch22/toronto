import React, { PropTypes } from 'react';
import GeneralOrbComponent from '../../containers/GeneralOrbComponent';
import { connect } from 'react-redux';
import HeaderWithClose from '../../component/utils/HeaderWithClose';
import crudComponentOperations from './ComponentCrudOperations';
import orbModelTraversal from '../../state/orbModelTraversal';

class App extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];

    return (
      <div className="container-app col-lg-2">
        <HeaderWithClose headerTextValue={this.props.label} modelNodeId={this.props.id} onClickClose={this.props.onClickRemoveApp} onChangeLabel={this.props.onChangeLabel} />
          {
            children.map((child) =>
              <GeneralOrbComponent key={child.id} child={child} />
            )
          }
      </div>
    );
  }
}

App.propTypes = {
  id: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.object,
  onClickRemoveApp: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function removeApp(component) {
  return crudComponentOperations.removeNode(component);
}

function changeLabel(component, newLabelValue) {
  return crudComponentOperations.updateProperty(component, 'label', newLabelValue);
}

const mapStateToProps = (state, ownProps) => {
  const appContainerModel = state.model.appContainer;
  const object = orbModelTraversal.find(appContainerModel, ownProps.id);

  return {
    label: object.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickRemoveApp: () => {
      dispatch(removeApp(ownProps));
    },
    onChangeLabel: (event) => {
      dispatch(changeLabel(ownProps, event.target.value));
    }
  };
};

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);


export default App;
