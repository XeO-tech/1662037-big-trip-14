import { createElement } from '../utils.js';

const createEmptyListPlaceholder = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class EmptyListPlaceholder {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return createEmptyListPlaceholder();
  }
  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
