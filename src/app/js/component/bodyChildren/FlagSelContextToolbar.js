import React, { PropTypes } from 'react';
import { default as DropDownListboxToolbar } from './dropDownListbox/Toolbar';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import HierNavButtonToolbar from '../../component/bodyChildren/HierNavButtonToolbar';

class FlagSelContextToolbar extends React.Component {
  render() {
    let toolbar = '';
    let description = '';
    switch (this.props.selectedViewModel.viewModel.typeLabel) {
      case ComponentTypes.DropDownListbox: {
        toolbar = <DropDownListboxToolbar selectedViewModel={this.props.selectedViewModel} />;
        description = 'This is a select box.';
        break;
      }
      default:
        break;
    }

    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div className="bc-toolbar-title-label">
            { this.props.selectedViewModel.viewModel.typeLabel }
          </div>
          <div className="bc-toolbar-description">
            { description }
          </div>
        </div>
        <div className="bc-toolbar-col-2">
          <div className="bc-toolbar-col-2">
            <HierNavButtonToolbar selectedChildViewId={this.props.selectedViewModel.id} />
            { toolbar }
          </div>
        </div>
      </div>
    );
  }
}

FlagSelContextToolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default FlagSelContextToolbar;
