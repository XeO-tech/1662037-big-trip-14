import SiteMenuView from './view/site-menu.js';
import { generateEvents, offersFullList, destinationsFullList } from './mocks/events.js';
import { render } from './utils/render.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import EventsModel from './model/events.js';
import FiltersModel from './model/filters.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);

const filtersElement = document.querySelector('.trip-controls__filters');
const menuElement = document.querySelector('.trip-main__trip-controls');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FiltersModel();

const tripPresenter = new TripPesenter(eventsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, eventsModel);

render(menuElement, new SiteMenuView(), 'beforeend');
tripPresenter.init(offersFullList, destinationsFullList);
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

