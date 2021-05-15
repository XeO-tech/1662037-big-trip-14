import AbstractView from './abstract.js';

const createErrorTemplate = () => {
  return '<p class="trip-events__msg">Can\'t load data from server...</p>';
};

export default class Error extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
