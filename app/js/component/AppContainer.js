import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppContainerToolbar from '../component/dashboard/appContainer/AppContainerToolbar';
import Island from '../component/dashboard/Island';
import PseudoModalWrangler from '../component/modals/PseudoModalWrangler';
import ViewTypes from '../views/ViewTypes';
import _ from 'lodash';

class AppContainer extends React.Component {
  render() {
    return (
      <div>
        <AppContainerToolbar />
        <div className="container-fluid app-container">
          {
            this.props.children.map((child) =>
              <Island key={child.id} child={child} model="" />
            )
          }
        </div>
        <PseudoModalWrangler />
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  appContainerChildren: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = (state) => {
  let children = [];

  if (state.views) {
    const dashboardIslandView = _.find(state.views, (view) => {
      return view.viewType === ViewTypes.Dashboard.Island;
    });
    if (dashboardIslandView) {
      children = [].concat(dashboardIslandView.viewModel.children[0].viewModel.children);
      // c.lo(state.views, 'state.views: ');
      // c.lo(children, 'children: ');
    }
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
