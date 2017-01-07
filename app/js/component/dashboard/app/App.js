import React, { PropTypes } from 'react';
import Island from '../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import crudComponentOperations from '../../CrudOperations';
import graphTraversal from '../../../state/graphTraversal';

class App extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];
    return (
      <div className="container-app col-lg-2 dashboard-app">
        <div>
          <Header headerTextValue={this.props.label} modelNodeId={this.props.id} onClickClose={this.props.onClickRemoveApp} onChangeLabel={this.props.onChangeLabel} />
          {
            children.map((child) =>
              <Island key={child.id} child={child} />
            )
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  id: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(React.PropTypes.object),
  onClickRemoveApp: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function changeLabel(component, newLabelValue) {
  return crudComponentOperations.updateProperty(component, 'label', newLabelValue);
}

const mapStateToProps = (state, ownProps) => {
  const appContainerModel = state.model.appContainer;
  const object = graphTraversal.find(appContainerModel, ownProps.id);

  return {
    label: object.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
