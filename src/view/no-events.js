import AbstractView from './abstract.js';

const createEmptyListPlaceholder = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class EmptyListPlaceholder extends  AbstractView {
  getTemplate() {
    return createEmptyListPlaceholder();
  }
}
