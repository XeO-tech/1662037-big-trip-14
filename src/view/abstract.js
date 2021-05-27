import { createElement } from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t create instance of Abstract class. Use inheritance.');
    }
    this._element = null;
    this._callback = {};
  }

  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    throw new Error('Abstract method is not implemented: getTemplate');
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
