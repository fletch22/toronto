import React, { PropTypes } from 'react';
import { default as LayoutToolbar } from './layout/Toolbar';
import { default as BodyToolbar } from './body/Toolbar';
import ComponentTypes from '../../domain/component/ComponentTypes';
import HierNavButtonToolbar from '../../component/bodyChildren/HierNavButtonToolbar';

class SelectedContextToolbar extends React.Component {

  render() {
    let toolbar = '';
    let description = '';
    switch (this.props.selectedTypeLabel) {
      case ComponentTypes.WebPage: {
        toolbar = <BodyToolbar selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />;
        description = (<span>This element is the root of your page. There can be only <a href="https://media.giphy.com/media/sqtSOp8DOsIa4/giphy.gif">one.</a></span>);
        break;
      }
      case ComponentTypes.Layout: {
        toolbar = <LayoutToolbar selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />;
        description = 'This element helps you form the foundation your page. Want a smaller, nested, layout? Select an element, then click the \'Layout\' button.';
        break;
      }
      default:
        break;
    }

    return (
      <div>
        <div className="bc-toolbar-col-1">
          <div className="bc-toolbar-title-label">
          { this.props.selectedTypeLabel }
          </div>
          <div className="bc-toolbar-description">
            { description }
          </div>
        </div>
        <div className="bc-toolbar-col-2">
          <HierNavButtonToolbar selectedChildViewId={this.props.selectedChildViewId} />
          { toolbar }
        </div>
      </div>
    );
  }
}

SelectedContextToolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  selectedTypeLabel: PropTypes.string
};

export default SelectedContextToolbar;

