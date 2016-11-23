import React from 'react';
import { connect } from 'react-redux';
import AppContainerToolbar from '../component/utils/AppContainerToolbar';
import update from 'react-addons-update';
import GeneralOrbComponent from './GeneralOrbComponent';
import PseudoModalWrangler from '../component/modals/PseudoModalWrangler';

class AppContainer extends React.Component {
  render() {
    return (
      <div>

        <AppContainerToolbar />
        <div className="container-fluid app-container">
          {
            this.props.children.map((child) =>
              <GeneralOrbComponent key={child.id} child={child} />
            )
          }
        </div>
        <PseudoModalWrangler />
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
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
  mapStateToProps,
  null
)(AppContainer);

export default AppContainer;
