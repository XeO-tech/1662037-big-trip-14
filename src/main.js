import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import EventItemView from './view/event-item.js';
import AddAndEditFormView from './view/form-add-and-edit-event.js';
import SortingPanelView from './view/sorting-panel.js';
import EmptyListPlaceholderView  from './view/no-events.js';
import FiltersPanelView from './view/filters.js';
import SiteMenuView from './view/site-menu.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending, render } from './utils.js';

const EVENT_NUMBERS = 2;

const events = generateEvents(EVENT_NUMBERS);
const eventsSortedByStartDate = sortEventsByStartDateAscending(events);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

render(filtersElement, new FiltersPanelView().getElement(), 'beforeend');
render(tripInfoElement, new TripInfoView(events).getElement(), 'afterbegin');
render(tripInfoElement, new TripCostView(events).getElement(), 'beforeend');
render(menuElement, new SiteMenuView().getElement(), 'beforeend');
render(sortingElement, new SortingPanelView().getElement(), 'afterbegin');
// render(eventListElement, new AddAndEditFormView().getElement(), 'beforeend');
render(eventListElement, new AddAndEditFormView(eventsSortedByStartDate[0]).getElement(), 'beforeend');


for (let i = 1; i < EVENT_NUMBERS; i++) {
  render(eventListElement, new EventItemView(eventsSortedByStartDate[i]).getElement(), 'beforeend');
}
if (Object.keys(events).length === 0) {
  render(eventListElement, new EmptyListPlaceholderView().getElement(), 'beforebegin');
}
