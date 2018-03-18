import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class CollectionMenu extends React.Component {
  render() {
    const children = this.props.children;
    const position = this.props.position;
    return (
      <div style={{ position: 'absolute', left: `${position.x}px`, top: `${position.y}px`, border: '3px solid red', width: '100px' }}>
        foo
        {
          children.map((child) =>
            <div>Menu item</div>
          )
        }
      </div>
    );
  }
}

CollectionMenu.propTypes = {
  data: PropTypes.object,
  position: PropTypes.object,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  return {
    children: ownProps.data.children,
    position: ownProps.data.position
  };
};

CollectionMenu = connect(
  mapStateToProps,
  null
)(CollectionMenu);

export default CollectionMenu;
