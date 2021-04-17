import { render, replace } from '../utils/render.js';
import EventItemView from '../view/event-item.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';

export default class EventPresenter {
  constructor() {
    this._eventComponent = null;
    this._eventEditFormComponent = null;
    this._eventListElement = document.querySelector('.trip-events__list');

    this._handleDownArrowClick = this._handleDownArrowClick.bind(this);
    this._handleUpArrowClick = this._handleUpArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init(eventItem) {
    this._data = eventItem;
    this._eventComponent = new EventItemView(eventItem);
    this._eventEditFormComponent = new AddAndEditFormView(eventItem);

    this._eventComponent.setArrowClickHandler(this._handleDownArrowClick);
    this._eventEditFormComponent.setArrowClickHandler(this._handleUpArrowClick);
    this._eventEditFormComponent.setSubmitHandler(this._handleFormSubmit);

    render(this._eventListElement, this._eventComponent, 'beforeend');
  }

  _replaceEventWithEditForm() {
    replace(this._eventEditFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeydownHandler);
  }

  _replaceEditFormWitnEvent() {
    replace(this._eventComponent, this._eventEditFormComponent);
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _handleDownArrowClick() {
    this._replaceEventWithEditForm();
  }

  _handleUpArrowClick() {
    this._replaceEditFormWitnEvent();
  }

  _handleFormSubmit() {
    this._replaceEditFormWitnEvent();
  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditFormWitnEvent();
    }
  }
}
