import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Button from '../../bodyChildren/toolbar/Button';


class DataNarrative extends React.Component {

  render() {
    return (
      <div className="flex-normal">
        <div>
          <div className="flex-vertical data-narrative-button-menu">
            <Button faClass="fa fa-cog " onClick={this.props.onClickCog} tooltipText="Test Button" />
          </div>
        </div>
        <div>
          <BarChart data={this.props.data} size={[500, 500]} />
        </div>
      </div>
    );
  }
}

DataNarrative.propTypes = {
  id: PropTypes.any,
  data: PropTypes.object,
  onCancelClick: PropTypes.func,
  onClickCog: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  c.lo(ownProps.data, 'data: ');

  return {
    id: ownProps.id,
    data: ownProps.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickCog: (event) => {
      c.l('Clicked test');
      // dispatch(actionUpdateViewPropertyValue(ownProps.id, ownProps.path, event.target.value, persistState));
    }
  };
};

DataNarrative = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataNarrative);

export default DataNarrative;
