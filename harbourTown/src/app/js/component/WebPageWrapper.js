import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Body from './bodyChildren/body/Body';
import stateTraversal from '../../../common/state/stateTraversal';
import ComponentTypes from '../../../common/domain/component/ComponentTypes';


class WebPageWrapper extends React.Component {
  render() {
    const height = 670;
    const tabContentHeight = height - 80;

    const style = { border: '1px solid red' };

    return (
      <div style={ style }>
        <div className="flex-normal">
          <div className="pseudo-modal-content" style={ { height: `${height}px` } }>
            <div className="flex-pseudo-modal" style={ { flexGrow: 1, height: `${tabContentHeight}px` } }>
              <div style={ { flexGrow: 1 } }>
                <Body model={this.props.model} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WebPageWrapper.propTypes = {
  model: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const webPage = stateTraversal.findAllWithTypeLabel(state, ComponentTypes.WebPage)[0];
  return {
    model: webPage
  };
};

WebPageWrapper = connect(
  mapStateToProps,
  null
)(WebPageWrapper);

export default WebPageWrapper;
