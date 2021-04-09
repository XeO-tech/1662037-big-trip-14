import { createFiltersTemplate } from './view/filters.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSortingTemplate } from './view/sorting.js';
import { createEventItemTemplate } from './view/event-item.js';
import { createEditEventFormTemplate } from './view/form-add-and-edit-event.js';
import { generateEvent } from './mocks/event.js';

const EVENT_NUMBERS = 20;

const renderElement = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

const events = new Array(EVENT_NUMBERS).fill().map(() => generateEvent());
const eventsSortedByStartDate = [...events].sort((a, b) => new Date(a.date_from) - new Date(b.date_from));

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');
const blankListPlaceholder = '<p>Click New Event to create your first point</p>';


renderElement(filtersElement, createFiltersTemplate(), 'beforeend');
renderElement(tripInfoElement, createTripInfoTemplate(events), 'afterbegin');
renderElement(tripInfoElement, createTripCostTemplate(events), 'beforeend');
renderElement(menuElement, createSiteMenuTemplate(), 'beforeend');
renderElement(sortingElement, createSortingTemplate(), 'afterbegin');
renderElement(eventListElement, createEditEventFormTemplate(), 'afterbegin');
renderElement(eventListElement, createEditEventFormTemplate(eventsSortedByStartDate[0]), 'beforeend');

for (let i = 1; i < EVENT_NUMBERS; i++) {
  renderElement(eventListElement, createEventItemTemplate(eventsSortedByStartDate[i]), 'beforeend');
}
if (Object.keys(events).length === 0) {
  renderElement(eventListElement, blankListPlaceholder, 'afterbegin');
}
