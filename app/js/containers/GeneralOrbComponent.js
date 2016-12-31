import React, { PropTypes } from 'react';
import App from '../component/orb/App';
import Website from '../component/orb/app/website/Website';
import WebFolder from '../component/orb/app/website/folder/Folder';
import Page from '../component/orb/app/website/page/Page';
import ComponentTypes from '../domain/component/ComponentTypes';

class GeneralOrbComponent extends React.Component {

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
        component = <div className="container-app col-lg-2">unknown object</div>;
    }

    return (
      <div>
        { component }
      </div>
    );
  }
}

GeneralOrbComponent.propTypes = {
  child: PropTypes.object.isRequired
};

export default GeneralOrbComponent;
