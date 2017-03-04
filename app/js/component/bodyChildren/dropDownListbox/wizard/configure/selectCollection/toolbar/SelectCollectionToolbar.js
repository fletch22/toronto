import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../../../../../toolbar/Button';

class SelectCollectionToolbar extends React.Component {

  render() {
    return (
      <div>
        <Button faClass="fa-plus" onClick={this.props.onClickAddCollection} tooltipText="Configure Select" />
      </div>
    );
  }
}

SelectCollectionToolbar.propTypes = {
  viewId: PropTypes.string,
  buttonNextDisabled: PropTypes.bool,
  datastores: PropTypes.array,
  onClickAddCollection: PropTypes.func
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClickAddCollection: () => {
//       c.l('Clicked add collection...');
//     }
//   };
// };
//
//
// SelectCollectionToolbar = connect(
//   null,
//   mapDispatchToProps
// )(SelectCollectionToolbar);

export default SelectCollectionToolbar;
