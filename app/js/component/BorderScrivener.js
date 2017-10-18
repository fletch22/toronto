import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionScribeBorder } from '../actions/index.js';
import DragCorner from './dragAndDrop/DragCorner';

class BorderScrivener extends React.Component {

  constructor(props) {
    super(props);
    this.drawSelectionRectangle = this.drawSelectionRectangle.bind(this);
    this.fireBorderScrivenerRedraw = this.fireBorderScrivenerRedraw.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.drawSelectionRectangle);
  }

  componentDidUpdate(prevProps) {
    if (this.props.top !== prevProps.top
      || this.props.left !== prevProps.left
      || this.props.width !== prevProps.width
      || this.props.height !== prevProps.height) {
      this.drawSelectionRectangle();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawSelectionRectangle);
  }

  fireBorderScrivenerRedraw() {
    window.setTimeout(() => {
      this.drawSelectionRectangle();
      this.fireBorderScrivenerRedraw();
    }, 10);
  }

  drawSelectionRectangle() {
    if (this.props.selectedElementId) {
      this.props.onChange();
    }
  }

  render() {
    let borders = null;

    const rect = {
      top: this.props.top,
      left: this.props.left,
      height: this.props.height,
      width: this.props.width
    };

    if (!!rect && !!this.props.selectedElementId) {
      const borderThickness = 3;
      const topOffsetWidth = 3 + borderThickness;

      const dragCornerOffsetX = rect.width - 1;

      const topStyle = {
        top: `${rect.top - topOffsetWidth}px`,
        left: `${rect.left}px`,
        width: `${rect.width + 2}px`,
        height: `${borderThickness}px`,
        border: '3px solid black'
      };

      const topRight = rect.left + rect.width - borderThickness - 1;
      const rightStyle = {
        top: `${rect.top}px`,
        left: `${topRight}px`,
        width: `${borderThickness}px`,
        height: `${rect.height + borderThickness + 3}px`,
        border: '3px solid blue'
      };

      const bottomStyle = {
        top: `${rect.top + rect.height}px`,
        left: `${rect.left - borderThickness - 3}px`,
        width: `${rect.width + 2}px`,
        height: `${borderThickness}px`,
        border: '3px solid orange'
      };

      const leftStyle = {
        top: `${rect.top - borderThickness - 3}px`,
        left: `${rect.left - borderThickness - 3}px`,
        width: `${borderThickness}px`,
        height: `${rect.height + borderThickness + 3}px`,
        border: '3px solid green'
      };

      borders = (<div>
        <div className="bc-outline-border" style={ topStyle }>
          <DragCorner dragCornerOffsetX={dragCornerOffsetX} clazz={"DragCorner"}
            selectedElementId={this.props.selectedElementId}
            selectedElementIndex={this.props.selectedElementIndex}
          />
        </div>
        <div className="bc-outline-border" style={ rightStyle }></div>
        <div className="bc-outline-border" style={ bottomStyle }></div>
        <div className="bc-outline-border" style={ leftStyle }></div>
      </div>);
    }

    return (
      <div>
      { borders }
      </div>
    );
  }
}

BorderScrivener.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  onChange: PropTypes.func,
  selectedElementId: PropTypes.string,
  selectedElementIndex: PropTypes.number
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: () => {
      dispatch(actionScribeBorder());
    }
  };
};

BorderScrivener = connect(
  null,
  mapDispatchToProps
)(BorderScrivener);


export default BorderScrivener;
