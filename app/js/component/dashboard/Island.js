import React, { PropTypes } from 'react';
import App from './app/App';
import Website from './app/website/Website';
import WebFolder from './app/website/folder/Folder';
import Page from './app/website/page/Page';
import ComponentTypes from '../../domain/component/ComponentTypes';

class Island extends React.Component {

  render() {
    let component;
    switch (this.props.child.typeLabel) {
      case ComponentTypes.App: {
        component = <App {...this.props.child} />;
        break;
      }
      case ComponentTypes.Website: {
        component = <Website {...this.props.child} />;
        break;
      }
      case ComponentTypes.WebFolder: {
        component = <WebFolder {...this.props.child} />;
        break;
      }
      case ComponentTypes.WebPage: {
        component = <Page {...this.props.child} />;
        break;
      }
      default:
        component = null;
    }

    return (
      <div>
        { component }
      </div>
    );
  }
}

Island.propTypes = {
  child: PropTypes.object.isRequired
};

export default Island;
