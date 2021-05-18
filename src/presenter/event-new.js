import { render, remove, RenderPosition } from '../utils/render.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';
import { UserAction, UpdateType } from '../consts.js';

export default class EventNewPresenter {
  constructor(changeEvent) {
    this._eventEditFormView = null;
    this._eventListElement = document.querySelector('.trip-events__list');
    this._changeEvent = changeEvent;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
  }

  init(offersFullList, destinationFullList, destinationNames) {
    if (this._eventEditFormView !== null) {
      return;
    }

    const eventItem = {};
    this._eventEditFormView = new AddAndEditFormView( eventItem, offersFullList, destinationFullList, destinationNames);
    this._newEventButon = document.querySelector('.trip-main__event-add-btn');

    this._eventEditFormView.setSubmitHandler(this._handleFormSubmit);
    this._eventEditFormView.setCancelClickHandler(this._handleCancelClick);

    this._newEventButon.disabled = true;

    render(this._eventListElement, this._eventEditFormView, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeydownHandler);
  }

  destroy() {
    if (this._eventEditFormView === null) {
      return;
    }
    remove(this._eventEditFormView);

    this._eventEditFormView = null;
    this._newEventButon.disabled = false;

    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _handleFormSubmit(eventItem) {
    this._changeEvent(UserAction.ADD_EVENT, UpdateType.MAJOR, eventItem);
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  setSaving() {
    this._eventEditFormView.updateData({
      isDisabled: true,
      isSaving: true,
    }, true);
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditFormView.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      }, true);
    };

    this._eventEditFormView.shake(resetFormState);
  }
}
