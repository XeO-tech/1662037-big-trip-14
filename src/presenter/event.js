import { render, replace, remove } from '../utils/render.js';
import EventItemView from '../view/event-item.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';

export default class EventPresenter {
  constructor(changeEvent) {
    this._eventComponent = null;
    this._eventEditFormComponent = null;
    this._eventListElement = document.querySelector('.trip-events__list');
    this._changeEvent = changeEvent;

    this._handleDownArrowClick = this._handleDownArrowClick.bind(this);
    this._handleUpArrowClick = this._handleUpArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(eventItem) {
    this._data = eventItem;

    const prevEventComponent = this._eventComponent;
    const prevEventEditFormComponent = this._eventEditFormComponent;
    this._eventComponent = new EventItemView(eventItem);
    this._eventEditFormComponent = new AddAndEditFormView(eventItem);

    this._eventComponent.setArrowClickHandler(this._handleDownArrowClick);
    this._eventEditFormComponent.setArrowClickHandler(this._handleUpArrowClick);
    this._eventEditFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null || prevEventEditFormComponent === null) {
      render(this._eventListElement, this._eventComponent, 'beforeend');
      return;
    }
    if (this._eventListElement.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }
    remove(prevEventComponent);
    remove(prevEventEditFormComponent);
    // if (this._eventListElement.contains(prevEventEditFormComponent.getElement())) {
    //   replace(this._eventEditFormComponent, prevEventEditFormComponent);
    // }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditFormComponent);
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

  _handleFavoriteClick() {
    this._changeEvent(
      Object.assign(
        {},
        this._data,
        {
          is_favorite: !this._data.is_favorite,
        },
      ),
    );

  }

  _escKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditFormWitnEvent();
    }
  }
}
