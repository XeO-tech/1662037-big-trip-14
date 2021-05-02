import FiltersPanelView from './view/filters.js';
import SiteMenuView from './view/site-menu.js';
import { generateEvents, offersFullList, destinationsFullList } from './mocks/events.js';
import { render } from './utils/render.js';
import TripPesenter from './presenter/trip.js';
import EventsModel from './model/events.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);

const filtersElement = document.querySelector('.trip-controls__filters');
const menuElement = document.querySelector('.trip-main__trip-controls');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripPresenter = new TripPesenter(eventsModel);

render(menuElement, new SiteMenuView(), 'beforeend');
render(filtersElement, new FiltersPanelView(), 'beforeend');
tripPresenter.init(offersFullList, destinationsFullList);

