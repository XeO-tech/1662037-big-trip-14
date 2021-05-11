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

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const menuContainerElement = document.querySelector('.trip-main__trip-controls');
const statisticsContainerElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const statisticsView = new StatisticsView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersContainerElement, filtersModel, eventsModel);


const handleMenuClick = (target) => {
  switch (target) {
    case MenuItems.TABLE:
      statisticsView.hideElement();
      tripPresenter.showElement();
      break;
    case MenuItems.STATS:
      tripPresenter.hideElement();
      statisticsView.showElement();
      break;
  }
};

eventsModel.setEvents(events);
destinationsModel.setDestinations(destinationsFullList);

render(menuContainerElement, siteMenuView, 'beforeend');
render(statisticsContainerElement, statisticsView, 'afterbegin');

siteMenuView.setMenuClickHandler(handleMenuClick);

tripPresenter.init(offersFullList);
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

