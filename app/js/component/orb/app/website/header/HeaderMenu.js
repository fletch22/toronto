import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { actionModalFormShow, ModalFormTypes } from '../../../../../actions/modal/index';
import { actionAppToggleMenu } from '../../../../../actions/dashboard/app/index';
import 'css/modules/menu';

class HeaderMenu extends React.Component {
  static menuKeys() {
    return {
      ADD_FOLDER: 'ADD_FOLDER'
    };
  }

  foo() {

  }

  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu onClick={this.props.onMenuClick} className="f22-menu">
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
  isShowingHeaderMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  modelNodeId: PropTypes.any,
  onMouseLeave: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case HeaderMenu.menuKeys().ADD_FOLDER: {
        dispatch(actionModalFormShow(ModalFormTypes.WEBSITE.CREATE_FOLDER, { modelNodeId: ownProps.modelNodeId }));
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
