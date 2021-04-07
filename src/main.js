import { createFiltersTemplate } from './view/filters.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSortingTemplate } from './view/sorting.js';
import { createEventItemTemplate } from './view/event-item.js';
import { createEditEventFormTemplate } from './view/form-edit-event.js';
import { createAddEventFormTemplate } from './view/form-add-event.js';
import { generateEvent} from './mocks/event.js';

const EVENT_NUMBERS = 3;

const renderElement = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');


renderElement(filtersElement, createFiltersTemplate(), 'beforeend');
renderElement(tripInfoElement, createTripInfoTemplate(), 'afterbegin');
renderElement(tripInfoElement, createTripCostTemplate(), 'beforeend');
renderElement(menuElement, createSiteMenuTemplate(), 'beforeend');
renderElement(sortingElement, createSortingTemplate(), 'afterbegin');
renderElement(eventListElement, createEditEventFormTemplate(), 'afterbegin');
renderElement(eventListElement, createAddEventFormTemplate(), 'beforeend');

for (let i = 0; i < EVENT_NUMBERS; i++) {
  renderElement(eventListElement, createEventItemTemplate(), 'beforeend');
}

const events = new Array(20).fill().map(() => generateEvent());


