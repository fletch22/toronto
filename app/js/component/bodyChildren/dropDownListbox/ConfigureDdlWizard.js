import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import { actionCarouselSlideRight, actionCarouselSlideLeft, actionCarouselSlideToIndex } from '../../../actions/wizard/index.js';
import SelectItemOrContainerSlide from './wizard/configure/SelectItemOrContainerSlide';
import SelectDdlFieldsView from './wizard/configure/SelectDdlFieldsView';
import SelectDataSourceType from './wizard/configure/SelectDataSourceType';
import CreateCollectionView from './wizard/configure/CreateCollectionView';
import WizardViews from './wizard/configure/WizardViews';
import SaveDdlInfo from './wizard/configure/SaveDdlInfo';

class ConfigureDdlWizard extends React.Component {

  render() {
    const activeIndex = this.props.activeIndex;

    return (
        <div style={{ width: '100%' }}>
          <Carousel activeIndex={activeIndex} direction={null} onSelect={this.props.handleSelect} indicators={false} interval={0} controls={false}>
            <Carousel.Item key={WizardViews.SELECT_DATASOURCE_TYPE}>
              <SelectDataSourceType isSlideActive={activeIndex === WizardViews.SELECT_DATASOURCE_TYPE} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.SELECT_COLLECTION_VIEW}>
              <SelectItemOrContainerSlide isSlideActive={activeIndex === WizardViews.SELECT_COLLECTION_VIEW} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.SELECT_DDL_FIELDS}>
              <SelectDdlFieldsView isSlideActive={activeIndex === WizardViews.SELECT_DDL_FIELDS} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.CREATE_COLLECTION}>
              <CreateCollectionView isSlideActive={activeIndex === WizardViews.CREATE_COLLECTION} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.SAVE_DDL_INFO}>
              <SaveDdlInfo isSlideActive={activeIndex === WizardViews.SAVE_DDL_INFO} wizardData={this.props.data} />
            </Carousel.Item>
          </Carousel>
        </div>
    );
  }
}

ConfigureDdlWizard.propTypes = {
  id: PropTypes.any,
  data: PropTypes.object,
  activeIndex: PropTypes.any,
  onCancelClick: PropTypes.func,
  handleSelect: PropTypes.func,
  onClickSlideRight: PropTypes.func,
  onClickSlideLeft: PropTypes.func,
  onClickSlideToIndex: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.data.id,
    activeIndex: ownProps.data.activeIndex
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSelect: (selectedIndex, e) => {
      // c.l(selectedIndex);
      // c.l(e);
      // dispatch(action(ownProps.id));
    },
    onClickSlideRight: () => {
      dispatch(actionCarouselSlideRight(ownProps.id));
    },
    onClickSlideLeft: () => {
      dispatch(actionCarouselSlideLeft(ownProps.id));
    },
    onClickSlideToIndex: (event) => {
      dispatch(actionCarouselSlideToIndex(ownProps.id, event.currentTarget.dataset.index));
    }
  };
};

ConfigureDdlWizard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigureDdlWizard);

export default ConfigureDdlWizard;
