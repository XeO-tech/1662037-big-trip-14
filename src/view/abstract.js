import { createElement } from '../utils.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t create instance of Abstract class. Use inheritance.');
    }
    this._element = null;
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
}
