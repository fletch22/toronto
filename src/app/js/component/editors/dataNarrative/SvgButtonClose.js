import React, { PropTypes } from 'react';
import closeButton from 'app/images/closeButton.svg';
import { actionDoNothing } from 'app/js/actions';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';

class SvgButtonClose extends React.Component {

  static getTranslateAttribute(x, y) {
    return `translate(${x}, ${y})`;
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);

    g.on('click', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();

      this.props.onCloseButtonClick();
    });

    g.on('dblclick', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });
  }

  render() {
    const width = 10;

    let transform = '';
    let transformImage = '';
    let componentBackground;
    let componentImage;
    if (this.props.coords) {
      const x = this.props.coords.x;
      const y = this.props.coords.y;
      transform = SvgButtonClose.getTranslateAttribute(x + this.props.parentWidth - (width + 1), y);
      transformImage = `${transform} scale(.02)`;
      componentBackground = (
        <rect rx="1" height={width} width={width} fill="white" transform={transform} />
      );
      componentImage = (
        <image xlinkHref={closeButton} transform={transformImage} fill="white" style={{ opacity: 0.5 }} />
      );
    }

    return (
      <g ref="rootGroup">
        {
          componentBackground
        }
        {
          componentImage
        }
      </g>
    );
  }
}

SvgButtonClose.propTypes = {
  parentWidth: PropTypes.number,
  onCloseButtonClick: PropTypes.func,
  fooClick: PropTypes.func,
  coords: PropTypes.object
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fooClick: () => {
      c.l('fooClick...');
      // dispatch(actionDoNothing());
    }
  };
};

SvgButtonClose = connect(
  null,
  mapDispatchToProps
)(SvgButtonClose);

export default SvgButtonClose;
