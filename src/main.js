import EventsModel from './model/events.js';
import DestinationsModel from './model/destinations.js';
import FiltersModel from './model/filters.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import { generateEvents, offersFullList, destinationsFullList } from './mocks/events.js';
import { render, replace } from './utils/render.js';
import { MenuItems } from './consts.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);

const filtersElement = document.querySelector('.trip-controls__filters');
const menuElement = document.querySelector('.trip-main__trip-controls');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const statisticsView = new StatisticsView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, eventsModel);
let eventsTableElement;

const handleMenuClick = (target) => {
  switch (target) {
    case MenuItems.TABLE:
      replace(eventsTableElement, statisticsView);
      break;
    case MenuItems.STATS:
      eventsTableElement = document.querySelector('.trip-events__list');
      replace(statisticsView, eventsTableElement);
      break;
  }
};

eventsModel.setEvents(events);
destinationsModel.setDestinations(destinationsFullList);

render(menuElement, siteMenuView, 'beforeend');
siteMenuView.setMenuClickHandler(handleMenuClick);

tripPresenter.init(offersFullList);
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

