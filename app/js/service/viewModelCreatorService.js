import _ from 'lodash';
import modalDispatcher from '../component/modals/modalDispatcher';
import crudActionCreator from '../actions/crudActionCreator';
import graphTraversal from '../state/graphTraversal';
import stateSyncService from '../service/stateSyncService';
import StatePackager from '../service/StatePackager';
import actionComponentCreator from '../reducers/viewModelFactory';
import ComponentTypes from '../domain/component/ComponentTypes';
import dancePartnerSynchronizer from '../views/dancePartnerSynchronizer';
import deepDiff from 'deep-diff';

class ViewModelCreatorService {

  constructor() {
    this.statePackager = new StatePackager();
  }

  createUpdateChildren(dispatch, parentViewModelId, viewModelChildren, successCallback, fnAdditionalStateMutator) {
    const dispatchHelper = () => {
      const createUpdate = (cuDispatch, state) => {
        try {
          const jsonStateOld = JSON.stringify(state);
          const stateNew = JSON.parse(jsonStateOld);

          const stateParentViewModel = graphTraversal.find(stateNew, parentViewModelId);

          // NOTE: 06-17-2017: This method synchronizes changes to the cloned viewModel with the original viewModel. Warning: There is no order of operations here -- multiple changes
          // might be synced without regard to ordinal impacts. Before finishing syncing a particular viewModel, it syncs with the global state model.
          viewModelChildren.forEach((viewModel) => {
            if (stateParentViewModel) {
              const stateViewModel = _.find(stateParentViewModel.viewModel.children, {id: viewModel.id});
              if (stateViewModel) {
                Object.assign(stateViewModel, viewModel);
              } else {
                stateParentViewModel.viewModel.children.push(viewModel);
              }
            }

            // NOTE: 06-17-2017: Converts back to model.
            let model = actionComponentCreator.extractModelFromViewModel(viewModel);
            const parentModel = graphTraversal.find(stateNew.model, model.parentId);

            // NOTE: 06-17-2017: Syncs with model.
            const stateModel = _.find(parentModel.children, { id: model.id });
            if (stateModel) {
              model = Object.assign({}, model);
              delete model.children;
              Object.assign(stateModel, model);
            } else {
              this.ensureModelSiblingsPrepped(parentModel.children, parentModel.typeLabel);
              parentModel.children.push(model);
            }
          });

          // NOTE: 06-17-2017: This method is meant to help synchronize the dashboard island view with changes to the state elsewhere.
          dancePartnerSynchronizer.update(stateNew);

          if (!!fnAdditionalStateMutator) {
            fnAdditionalStateMutator(stateNew);
          }

          const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
          return stateSyncService.saveState(statePackage)
            .then((result) => {
              console.debug('Success Callback.');
              return Promise.resolve(result);
            })
            .catch((error) => {
              console.debug('Failure Callback.');
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to create/update component.', cuDispatch);
              return Promise.reject(error);
            });
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      };

      return crudActionCreator.invoke(createUpdate, successCallback);
    };

    dispatch(dispatchHelper());
  }

  ensureViewModelSiblingsPrepped(children, parentTypeLabel) {
    switch (parentTypeLabel) {
      case ComponentTypes.Layout: {
        this.shiftViewModelTopRowDown(children);
        break;
      }
      default:
    }
  }

  ensureModelSiblingsPrepped(children, parentTypeLabel) {
    switch (parentTypeLabel) {
      case ComponentTypes.Layout: {
        this.shiftModelTopRowDown(children);
        break;
      }
      default:
    }
  }

  shiftViewModelTopRowDown(viewModels) {
    viewModels.forEach((vm) => {
      /* eslint-disable no-param-reassign */
      vm.viewModel.y += 1;
    });
  }

  shiftModelTopRowDown(models) {
    models.forEach((model) => {
      /* eslint-disable no-param-reassign */
      model.y += 1;
    });
  }
}

export default new ViewModelCreatorService();
