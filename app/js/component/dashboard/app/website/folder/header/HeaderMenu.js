import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { MenuItem, Divider } from 'rc-menu';
import 'rc-menu/assets/index.css';
// import '../../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { actionAppToggleMenu } from '../../../../../../actions/dashboard/app/index';
import { actionCreatePseudoModalComponent, actionUpdateViewPropertyValue } from '../../../../../../actions/index';
import ComponentTypes from '../../../../../../domain/component/ComponentTypes';
import 'css/modules/menu';
import crudComponentOperations from '../../../../../CrudOperations';

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
        <MenuItem key={HeaderMenu.menuKeys().ADD_FOLDER} className="menu-item">Add Folder</MenuItem>
        <MenuItem key={HeaderMenu.menuKeys().ADD_PAGE} className="menu-item">Add Page</MenuItem>
        <Divider />
        <MenuItem key={HeaderMenu.menuKeys().REMOVE} className="menu-item">Remove Web Folder</MenuItem>
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
  modelId: PropTypes.any,
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

const toggleMenu = (dispatch, ownProps) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.viewModelId, 'isShowingHeaderMenu', !ownProps.isShowingHeaderMenu, true));
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case HeaderMenu.menuKeys().ADD_FOLDER: {
        dispatch(actionCreatePseudoModalComponent(ComponentTypes.WebFolder, { parentModelId: ownProps.modelId }));
        toggleMenu(dispatch, ownProps);
        break;
      }
      case HeaderMenu.menuKeys().EDIT: {
        dispatch(actionCreatePseudoModalComponent(ComponentTypes.WebFolder, { modelNodeId: ownProps.modelId, parentModelNodeId: ownProps.parentModelNodeId }));
        toggleMenu(dispatch, ownProps);
        break;
      }
      case HeaderMenu.menuKeys().ADD_PAGE: {
        dispatch(actionCreatePseudoModalComponent(ComponentTypes.WebPage, { parentModelId: ownProps.modelId }));
        toggleMenu(dispatch, ownProps);
        break;
      }
      case HeaderMenu.menuKeys().REMOVE: {
        dispatch(remove(dispatch, ownProps.modelId));
        toggleMenu(dispatch, ownProps);
        break;
      }
      default:
    }
  },
  onMouseLeave: () => {
    toggleMenu(dispatch, ownProps);
  }
});

HeaderMenu = connect(
  null,
  mapDispatchToProps
)(HeaderMenu);

export default HeaderMenu;
