import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { actionModalPseudoShow } from '../../../../../actions/modal/index';
import { actionAppToggleMenu } from '../../../../../actions/dashboard/app/index';
import { actionCreateComponent } from '../../../../../actions/index';
import f22Uuid from '../../../../../util/f22Uuid';
import EditorNames from '../../../../EditorNames';
import ComponentTypes from '../../../../../domain/component/ComponentTypes';
import 'css/modules/menu';

class HeaderMenu extends React.Component {
  static menuKeys() {
    return {
      ADD_FOLDER: 'ADD_FOLDER',
      ADD_PAGE: 'ADD_PAGE',
      EDIT: 'EDIT'
    };
  }

  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu onClick={this.props.onMenuClick} className="f22-menu">
        <MenuItem key={HeaderMenu.menuKeys().EDIT} className="menu-item">Edit</MenuItem>
        <MenuItem key={HeaderMenu.menuKeys().ADD_FOLDER} className="menu-item">Add Folder</MenuItem>
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case HeaderMenu.menuKeys().ADD_FOLDER: {
        dispatch(actionCreateComponent(ComponentTypes.WebFolder, { parentModelId: ownProps.modelNodeId }));
        dispatch(actionAppToggleMenu(ownProps.modelNodeId));
        break;
      }
      case HeaderMenu.menuKeys().EDIT: {
        dispatch(actionCreateComponent(ComponentTypes.Website, { modelNodeId: ownProps.modelNodeId, parentModelNodeId: ownProps.parentModelNodeId }));
        dispatch(actionAppToggleMenu(ownProps.modelNodeId));
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
