import FiltersPanelView from './view/filters.js';
import SiteMenuView from './view/site-menu.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending } from './utils/events.js';
import { render } from './utils/render.js';
import TripPesenter from './presenter/trip.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);
const eventsSortedByDate = sortEventsByStartDateAscending(events);

const filtersElement = document.querySelector('.trip-controls__filters');
const menuElement = document.querySelector('.trip-main__trip-controls');
const tripPresenter = new TripPesenter();

render(menuElement, new SiteMenuView(), 'beforeend');
render(filtersElement, new FiltersPanelView(), 'beforeend');
tripPresenter.init(eventsSortedByDate);
