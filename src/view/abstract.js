import { createElement } from '../utils/render.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t create instance of Abstract class. Use inheritance.');
    }
    this._element = null;
    this._callback = {};
  }
  getTemplate() {
    throw new Error('Abstract method is not implemented: getTemplate');
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }

  hideElement() {
    this.getElement().classList.add('visually-hidden');
  }

  showElement() {
    this.getElement().classList.remove('visually-hidden');
  }
}
