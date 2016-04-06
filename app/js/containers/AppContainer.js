import React from 'react';
import { connect } from 'react-redux';
import AppContainerToolbar from '../component/app-container/AppContainerToolbar';
import update from 'react-addons-update';

class AppContainer extends React.Component {
  render() {
    return (
      <div>
        <AppContainerToolbar />
        <div className="container-fluid app-container">
          {
            this.props.children.map((child) =>
              <div className="container-app col-lg-2" key={child.id}>{child.label}</div>
            )
          }
        </div>
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = (state, props) => {
  let children = state.model.appContainer.children;
  const oldChildren = JSON.stringify(props.children);
  const newChildren = JSON.stringify(state.model.appContainer.children);

  if ((props.children && children && props.children.length !== children.length)
  || oldChildren !== newChildren) {
    children = update(state.model.appContainer.children, { $push: [] });
  }

  return {
    children
  };
};


AppContainer = connect(
  mapStateToProps
)(AppContainer);

export default AppContainer;
