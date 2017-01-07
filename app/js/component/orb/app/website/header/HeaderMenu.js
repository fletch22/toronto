import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { MenuItem, Divider } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { actionAppToggleMenu } from '../../../../../actions/dashboard/app/index';
import { actionCreateComponent } from '../../../../../actions/index';
import ComponentTypes from '../../../../../domain/component/ComponentTypes';
import crudComponentOperations from '../../../../CrudOperations';
import 'css/modules/menu';

class HeaderMenu extends React.Component {
  static menuKeys() {
    return {
      ADD_FOLDER: 'ADD_FOLDER',
      ADD_PAGE: 'ADD_PAGE',
      EDIT: 'EDIT',
      REMOVE: 'REMOVE'
    };
  }

  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu onClick={this.props.onMenuClick} className="f22-menu">
        <MenuItem key={HeaderMenu.menuKeys().EDIT} className="menu-item">Edit</MenuItem>
        <MenuItem key={HeaderMenu.menuKeys().ADD_FOLDER} className="menu-item">Add New Web Folder</MenuItem>
        <MenuItem key={HeaderMenu.menuKeys().ADD_PAGE} className="menu-item">Add New Page</MenuItem>
        <Divider />
        <MenuItem key={HeaderMenu.menuKeys().REMOVE} className="menu-item">Remove Website</MenuItem>
      </Menu>);
    }

    return (
      <div className="header-menu" onMouseLeave={this.props.onMouseLeave}>
        { menu }
      </div>
    );
  }
}

HeaderMenu.propTypes = {
  modelNodeId: PropTypes.any,
  parentModelNodeId: PropTypes.number,
  isShowingHeaderMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  onMouseLeave: PropTypes.func
};

const remove = (dispatch, id) => {

  const successCallback = () => {
    dispatch(actionAppToggleMenu(id));
  };

  return crudComponentOperations.removeNode(id, successCallback);
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case HeaderMenu.menuKeys().ADD_FOLDER: {
        dispatch(actionCreateComponent(ComponentTypes.WebFolder, { parentModelId: ownProps.modelNodeId }));
        dispatch(actionAppToggleMenu(ownProps.modelNodeId));
        break;
      }
      case HeaderMenu.menuKeys().ADD_PAGE: {
        dispatch(actionCreateComponent(ComponentTypes.WebPage, { parentModelId: ownProps.modelNodeId }));
        dispatch(actionAppToggleMenu(ownProps.modelNodeId));
        break;
      }
      case HeaderMenu.menuKeys().EDIT: {
        dispatch(actionCreateComponent(ComponentTypes.Website, { modelNodeId: ownProps.modelNodeId, parentModelNodeId: ownProps.parentModelNodeId }));
        dispatch(actionAppToggleMenu(ownProps.modelNodeId));
        break;
      }
      case HeaderMenu.menuKeys().REMOVE: {
        dispatch(remove(dispatch, ownProps.modelNodeId));
        break;
      }
      default:
    }
  },
  onMouseLeave: () => {
    dispatch(actionAppToggleMenu(ownProps.modelNodeId));
  }
});

HeaderMenu = connect(
  null,
  mapDispatchToProps
)(HeaderMenu);

export default HeaderMenu;
