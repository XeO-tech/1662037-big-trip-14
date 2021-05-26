import { render, replace, remove, RenderPosition } from '../utils/render.js';
import EventItemView from '../view/event-item.js';
import AddAndEditFormView from '../view/add-and-edit-form.js';
import { UserAction, UpdateType } from '../consts.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

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
    this._eventView = null;
    this._eventEditFormView = null;
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
    const prevEventView = this._eventView;
    const prevEventEditFormView = this._eventEditFormView;
    this._eventView = new EventItemView(eventItem);
    this._eventEditFormView = new AddAndEditFormView(eventItem, offersFullList, destinationFullList, destinationNames);

    this._eventView.setArrowClickHandler(this._handleDownArrowClick);
    this._eventView.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditFormView.setArrowClickHandler(this._handleUpArrowClick);
    this._eventEditFormView.setSubmitHandler(this._handleFormSubmit);
    this._eventEditFormView.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventView === null || prevEventEditFormView === null) {
      render(this._eventListElement, this._eventView, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventView, prevEventView);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditFormView, prevEventEditFormView);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventView);
    remove(prevEventEditFormView);
  }

  destroy() {
    remove(this._eventView);
    remove(this._eventEditFormView);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditFormView.reset(this._data);
      this._replaceEditFormWitnEvent();
    }
  }

  _replaceEventWithEditForm() {
    replace(this._eventEditFormView, this._eventView);
    document.addEventListener('keydown', this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormWitnEvent() {
    replace(this._eventView, this._eventEditFormView);
    document.removeEventListener('keydown', this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleDownArrowClick() {
    if (!isOnline()) {
      toast('You can\'t edit event while offline');
      this._eventView.shake();
      return;
    }

    this._replaceEventWithEditForm();
  }

  _handleUpArrowClick() {
    this._eventEditFormView.reset(this._data);
    this._replaceEditFormWitnEvent();
  }

  _handleFormSubmit(eventItem) {
    if (!isOnline()) {
      toast('You can\'t save event while offline');
      this._eventEditFormView.shake();
      return;
    }

    this._changeEvent(UserAction.UPDATE_EVENT, UpdateType.MAJOR, eventItem);
  }

  _handleDeleteClick() {
    if (!isOnline()) {
      toast('You can\'t delete event while offline');
      this._eventEditFormView.shake();
      return;
    }

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
      this._eventEditFormView.reset(this._data);
      this._replaceEditFormWitnEvent();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditFormView.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      }, true);
    };

    switch(state) {
      case State.SAVING:
        this._eventEditFormView.updateData({
          isDisabled: true,
          isSaving: true,
        }, true);
        break;
      case State.DELETING:
        this._eventEditFormView.updateData({
          isDisabled: true,
          isDeleting: true,
        }, true);
        break;
      case State.ABORTING:
        this._eventEditFormView.shake(resetFormState);
        break;
    }
  }
}
