import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppContainerToolbar from '../component/dashboard/appContainer/AppContainerToolbar';
import Island from '../component/dashboard/Island';
import PseudoModalWrangler from '../component/modals/PseudoModalWrangler';
import ViewTypes from '../views/ViewTypes';
import _ from 'lodash';
import BorderScrivener from '../component/utils/BorderScrivener';

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
        <BorderScrivener top={this.props.borderScrivener.top}
          left={this.props.borderScrivener.left}
          height={this.props.borderScrivener.height}
          width={this.props.borderScrivener.width}
          visible={this.props.borderScrivener.visible}
        />
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  appContainerChildren: PropTypes.arrayOf(PropTypes.object),
  borderScrivener: PropTypes.object
};

const mapStateToProps = (state) => {
  let children = [];

  if (state.views) {
    const dashboardIslandView = _.find(state.views, (view) => {
      return view.viewType === ViewTypes.Dashboard.Island;
    });
    if (dashboardIslandView) {
      children = [].concat(dashboardIslandView.viewModel.children[0].viewModel.children);
    }
  }

  const borderScrivener = state.borderScrivener;

  return {
    children,
    borderScrivener
  };
};

AppContainer = connect(
  mapStateToProps,
  null
)(AppContainer);

export default AppContainer;
