import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import ComponentChild from '../ComponentChild';

class Div extends React.Component {

  constructor(props) {
    super(props);
    this.bodySelect = this.bodySelect.bind(this);
  }

  bodySelect(event) {
    event.stopPropagation();
    const rectRaw = ReactDOM.findDOMNode(this).getBoundingClientRect();

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const rect = {
      left: parseInt(rectRaw.left, 10) + scrollLeft,
      top: parseInt(rectRaw.top, 10) + scrollTop,
      width: parseInt(rectRaw.width, 10),
      height: parseInt(rectRaw.height, 10)
    };
    this.props.onClick(rect);
  }

  render() {
    const children = (this.props.children) ? this.props.children : [];
    const style = JSON.parse(this.props.viewModel.viewModel.style);
    let wrapperClass = 'flex-bc';
    wrapperClass = (this.props.isSelected) ? `${wrapperClass} body-child-selected` : wrapperClass;

    // c.lo(style);

    return (
      <div className={wrapperClass} onClick={this.bodySelect} style={style}>
        {
          children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
          )
        }
      </div>
    );
  }
}

Div.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.any,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.array,
  style: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const style = ownProps.viewModel.viewModel.style;

  return {
    children: ownProps.viewModel.viewModel.children,
    isSelected: ownProps.viewModel.isSelected,
    style
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (rect) => {
      dispatch(actionSetCurrentBodyTool(ownProps.viewModel.id, rect));
    }
  };
};

Div = connect(
  mapStateToProps,
  mapDispatchToProps
)(Div);

export default Div;


