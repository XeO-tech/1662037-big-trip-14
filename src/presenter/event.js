import { render, replace, remove, RenderPosition } from '../utils/render.js';
import EventItemView from '../view/event-item.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';
import { UserAction, UpdateType } from '../consts.js';

const Mode = {
  DEFAULT: 'DEFALT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class EventPresenter {
  constructor(changeEvent, changeMode) {
    this._eventComponent = null;
    this._eventEditFormComponent = null;
    this._eventListElement = document.querySelector('.trip-events__list');
    this._changeEvent = changeEvent;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._handleDownArrowClick = this._handleDownArrowClick.bind(this);
    this._handleUpArrowClick = this._handleUpArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(eventItem, offersFullList, destinationFullList, destinationNames) {
    this._data = eventItem;
    const prevEventComponent = this._eventComponent;
    const prevEventEditFormComponent = this._eventEditFormComponent;
    this._eventComponent = new EventItemView(eventItem);
    this._eventEditFormComponent = new AddAndEditFormView(eventItem, offersFullList, destinationFullList, destinationNames);

    this._eventComponent.setArrowClickHandler(this._handleDownArrowClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditFormComponent.setArrowClickHandler(this._handleUpArrowClick);
    this._eventEditFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventEditFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditFormComponent === null) {
      render(this._eventListElement, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._eventEditFormComponent, prevEventEditFormComponent);
      this._mode = Mode.DEFAULT;
    }
    remove(prevEventComponent);
    remove(prevEventEditFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditFormComponent.reset(this._data);
      this._replaceEditFormWitnEvent();
    }
  }

  _replaceEventWithEditForm() {
    replace(this._eventEditFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormWitnEvent() {
    replace(this._eventComponent, this._eventEditFormComponent);
    document.removeEventListener('keydown', this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleDownArrowClick() {
    this._replaceEventWithEditForm();
  }

  _handleUpArrowClick() {
    this._eventEditFormComponent.reset(this._data);
    this._replaceEditFormWitnEvent();
  }

  _handleFormSubmit(eventItem) {
    this._changeEvent(UserAction.UPDATE_EVENT, UpdateType.MAJOR, eventItem);
    // this._replaceEditFormWitnEvent();
  }

  _handleDeleteClick() {
    this._changeEvent(
      UserAction.DELETE_EVENT,
      UpdateType.MAJOR,
      Object.assign(
        {},
        this._data,
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeEvent(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._data,
        {
          isFavorite: !this._data.isFavorite,
        },
      ),
    );
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventEditFormComponent.reset(this._data);
      this._replaceEditFormWitnEvent();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      }, true);
    };

    switch(state) {
      case State.SAVING:
        this._eventEditFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        }, true);
        break;
      case State.DELETING:
        this._eventEditFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        }, true);
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditFormComponent.shake(resetFormState);
        break;
    }
  }
}
