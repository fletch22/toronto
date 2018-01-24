import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppContainerToolbar from '../component/dashboard/appContainer/AppContainerToolbar';
import Island from '../component/dashboard/Island';
import PseudoModalWrangler from '../component/modals/PseudoModalWrangler';
import ViewTypes from '../views/ViewTypes';
import _ from 'lodash';
import BorderScrivener from './BorderScrivener';
import DropMarker from '../component/bodyChildren/DropMarker';

class AppContainer extends React.Component {
  render() {
    const islands = this.props.islands.map((island) => {
      const children = island.viewModel.children[0].viewModel.children;
      return children.map((child) =>
        <div className="container-fluid app-container">
          <Island key={child.id} child={child} model="" />
        </div>
      );
    });

    return (
      <div>
        <AppContainerToolbar />
        {
          islands
        }
        <PseudoModalWrangler />
        <BorderScrivener top={this.props.borderScrivener.top}
          left={this.props.borderScrivener.left}
          height={this.props.borderScrivener.height}
          width={this.props.borderScrivener.width}
          selectedElementId={this.props.borderScrivener.selectedElementId}
          selectedElementIndex={this.props.borderScrivener.selectedElementIndex}
          lastUpdateRequest={this.props.borderScrivener.lastUpdateRequest}
        />
        <DropMarker dragNDrop={this.props.dragNDrop} />
      </div>
    );
  }
}

AppContainer.propTypes = {
  appContainerChildren: PropTypes.arrayOf(PropTypes.object),
  borderScrivener: PropTypes.object,
  dragNDrop: PropTypes.object,
  islands: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  let islands;
  if (state.views) {
    islands = state.views.filter((view) => {
      return view.viewType === ViewTypes.Dashboard.Island;
    });
  }

  const borderScrivener = state.borderScrivener;
  const dragNDrop = state.dragNDrop;

  return {
    borderScrivener,
    dragNDrop,
    islands
  };
};

AppContainer = connect(
  mapStateToProps,
  null
)(AppContainer);

export default AppContainer;
