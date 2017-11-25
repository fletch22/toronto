import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { default as RcMenu, MenuItem, Divider } from 'rc-menu';
import 'rc-menu/assets/index.css';
import { actionCreatePseudoModalComponent } from '../../../../actions/index';
import ComponentTypes from '../../../../domain/component/ComponentTypes';
import { actionAppToggleMenu } from '../../../../actions/dashboard/app/index';
import '../../../../../css/modules/menu.scss';
import crudComponentOperations from '../../../CrudOperations';
import { actionUpdateViewPropertyValue } from '../../../../actions/index';

class HeaderMenu extends React.Component {
  static menuKeys() {
    return {
      CREATE_WEBSITE: 'CREATE_WEBSITE',
      REMOVE: 'REMOVE'
    };
  }

  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<RcMenu onClick={this.props.onMenuClick} className="f22-menu">
        <MenuItem key={HeaderMenu.menuKeys().CREATE_WEBSITE} className="menu-item">Add New Website</MenuItem>
        <Divider />
        <MenuItem key={HeaderMenu.menuKeys().REMOVE} className="menu-item">Remove App</MenuItem>
      </RcMenu>);
    }

    return (
      <div className="header-menu" onMouseLeave={this.props.onMouseLeave}>
        { menu }
      </div>
    );
  }
}

HeaderMenu.propTypes = {
  viewModelId: PropTypes.string,
  modelId: PropTypes.any,
  isShowingHeaderMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  modelNodeId: PropTypes.any,
  onMouseLeave: PropTypes.func
};

function removeApp(id) {
  return crudComponentOperations.removeNode(id);
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case HeaderMenu.menuKeys().CREATE_WEBSITE: {
        dispatch(actionCreatePseudoModalComponent(ComponentTypes.Website, { parentModelId: ownProps.modelId }));
        dispatch(actionAppToggleMenu(ownProps.modelId));
        break;
      }
      case HeaderMenu.menuKeys().REMOVE: {
        dispatch(removeApp(ownProps.modelId));
        dispatch(actionAppToggleMenu(ownProps.modelId));
        break;
      }
      default:
    }
  },
  onMouseLeave: () => {
    dispatch(actionUpdateViewPropertyValue(ownProps.viewModelId, 'isShowingHeaderMenu', !ownProps.isShowingHeaderMenu, true));
  }
});

HeaderMenu = connect(
  null,
  mapDispatchToProps
)(HeaderMenu);

export default HeaderMenu;
