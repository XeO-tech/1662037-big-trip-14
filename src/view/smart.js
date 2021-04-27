import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parentElement = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();

    parentElement.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  updateData(updatedInfo) {
    if (!updatedInfo) {
      return;
    }

    this._data = Object.assign({}, this._data, updatedInfo);

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
