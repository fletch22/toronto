import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import '../../../../../css/modules/container.scss';
import { actionModalPseudoShow, ModalFormTypes } from '../../../../actions/modal/index';
import { actionAppToggleMenu } from '../../../../actions/dashboard/app/index';
import 'css/modules/menu';

class HeaderMenu extends React.Component {
  static menuKeys() {
    return {
      CREATE_WEBSITE: 'CREATE_WEBSITE'
    };
  }

  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu onClick={this.props.onMenuClick} className="f22-menu">
        <MenuItem key={HeaderMenu.menuKeys().CREATE_WEBSITE} className="menu-item">Create Website</MenuItem>
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
      case HeaderMenu.menuKeys().CREATE_WEBSITE: {
        dispatch(actionModalPseudoShow(ModalFormTypes.APP.EDIT_WEBSITE_DETAILS, { modelNodeId: ownProps.modelNodeId }));
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
