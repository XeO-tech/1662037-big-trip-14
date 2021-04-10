import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripCostTemplate } from './view/trip-cost.js';
import { createEventItemTemplate } from './view/event-item.js';
import { createEditEventFormTemplate } from './view/form-add-and-edit-event.js';
import SortingPanel from './view/sorting-panel.js';
import EmptyListPlaceholder  from './view/no-events.js';
import Filters from './view/filters.js';
import SiteMenu from './view/site-menu.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending, render } from './utils.js';

const EVENT_NUMBERS = 2;

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

render(filtersElement, new Filters().getElement(), 'beforeend');
renderElement(tripInfoElement, createTripInfoTemplate(events), 'afterbegin');
renderElement(tripInfoElement, createTripCostTemplate(events), 'beforeend');
render(menuElement, new SiteMenu().getElement(), 'beforeend');
render(sortingElement, new SortingPanel().getElement(), 'afterbegin');
// renderElement(eventListElement, createEditEventFormTemplate(), 'afterbegin');
renderElement(eventListElement, createEditEventFormTemplate(eventsSortedByStartDate[0]), 'beforeend');

for (let i = 1; i < EVENT_NUMBERS; i++) {
  renderElement(eventListElement, createEventItemTemplate(eventsSortedByStartDate[i]), 'beforeend');
}
if (Object.keys(events).length === 0) {
  // renderElement(eventListElement, createEmptyListPlaceholder(), 'afterbegin');
  render(eventListElement, new EmptyListPlaceholder().getElement(), 'beforebegin');
}
