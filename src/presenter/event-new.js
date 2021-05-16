import { render, remove } from '../utils/render.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';
import { UserActions, UpdateTypes } from '../consts.js';

export default class EventNewPresenter {
  constructor(changeEvent) {
    this._eventEditFormComponent = null;
    this._eventListElement = document.querySelector('.trip-events__list');
    this._changeEvent = changeEvent;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleDeleteClick = this._handleCancelClick.bind(this);
  }

  init(offersFullList, destinationFullList, destinationNames) {
    if (this._eventEditFormComponent !== null) {
      return;
    }
    const eventItem = {};
    this._eventEditFormComponent = new AddAndEditFormView( eventItem, offersFullList, destinationFullList, destinationNames);
    this._newEventButon = document.querySelector('.trip-main__event-add-btn');

    this._eventEditFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventEditFormComponent.setCancelClickHandler(this._handleCancelClick);

    this._newEventButon.disabled = true;

    render(this._eventListElement, this._eventEditFormComponent, 'afterbegin');

    document.addEventListener('keydown', this._escKeydownHandler);
  }

  destroy() {
    if (this._eventEditFormComponent === null) {
      return;
    }
    remove(this._eventEditFormComponent);

    this._eventEditFormComponent = null;
    this._newEventButon.disabled = false;

    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _handleFormSubmit(eventItem) {
    this._changeEvent(UserActions.ADD_EVENT, UpdateTypes.MAJOR, eventItem);
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
    this._eventEditFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    }, true);
  }
}
