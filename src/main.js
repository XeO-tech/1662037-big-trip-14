import { createFiltersTemplate } from './view/filters.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createSortingTemplate } from './view/sorting.js';
import { createEventItemTemplate } from './view/event-item.js';
import { createEditEventFormTemplate } from './view/form-add-and-edit-event.js';
import EmptyListPlaceholder  from './view/no-events.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending, render } from './utils.js';

const EVENT_NUMBERS = 0;

const renderElement = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

const events = generateEvents(EVENT_NUMBERS);
const eventsSortedByStartDate = sortEventsByStartDateAscending(events);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

renderElement(filtersElement, createFiltersTemplate(), 'beforeend');
renderElement(tripInfoElement, createTripInfoTemplate(events), 'afterbegin');
renderElement(tripInfoElement, createTripCostTemplate(events), 'beforeend');
renderElement(menuElement, createSiteMenuTemplate(), 'beforeend');
renderElement(sortingElement, createSortingTemplate(), 'afterbegin');
// renderElement(eventListElement, createEditEventFormTemplate(), 'afterbegin');
renderElement(eventListElement, createEditEventFormTemplate(eventsSortedByStartDate[0]), 'beforeend');

for (let i = 1; i < EVENT_NUMBERS; i++) {
  renderElement(eventListElement, createEventItemTemplate(eventsSortedByStartDate[i]), 'beforeend');
}
if (Object.keys(events).length === 0) {
  // renderElement(eventListElement, createEmptyListPlaceholder(), 'afterbegin');
  render(eventListElement, new EmptyListPlaceholder().getElement(), 'beforebegin');
}
