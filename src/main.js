import EventsModel from './model/events.js';
import DestinationsModel from './model/destinations.js';
import FiltersModel from './model/filters.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import { generateEvents, offersFullList, destinationsFullList } from './mocks/events.js';
import { render, remove } from './utils/render.js';
import { MenuItems, UpdateTypes, FilterTypes } from './consts.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);


const menuContainerElement = document.querySelector('.trip-main__trip-controls');
const statisticsContainerElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(filtersModel, eventsModel);

let statisticsView = null;

const handleMenuClick = (target) => {
  switch (target) {
    case MenuItems.TABLE:
      filtersModel.setFilter(UpdateTypes.MINOR, FilterTypes.ALL);
      remove(statisticsView);
      tripPresenter.showElement();
      break;
    case MenuItems.STATS:
      statisticsView = new StatisticsView(eventsModel.getEvents());
      tripPresenter.hideElement();
      render(statisticsContainerElement, statisticsView, 'beforeend');
      break;
  }
};

eventsModel.setEvents(events);
destinationsModel.setDestinations(destinationsFullList);

render(menuContainerElement, siteMenuView, 'beforeend');
siteMenuView.setMenuClickHandler(handleMenuClick);

tripPresenter.init(offersFullList);
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

