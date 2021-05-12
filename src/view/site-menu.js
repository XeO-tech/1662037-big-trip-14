import AbstractView from './abstract.js';
import { MenuItems } from '../consts.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItems.TABLE}</a>
  <a class="trip-tabs__btn" href="#">${MenuItems.STATS}</a>
</nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    const previouslySelectedElement = this.getElement().querySelector('.trip-tabs__btn--active');

    previouslySelectedElement.classList.remove('trip-tabs__btn--active');
    evt.target.classList.add('trip-tabs__btn--active');

    this._callback.menuClick(evt.target.innerText);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
