import EventsModel from './model/events.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FiltersModel from './model/filters.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import { render, remove } from './utils/render.js';
import { MenuItems, UpdateTypes, FilterTypes } from './consts.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 3424nklfsdl1mcs';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const menuContainerElement = document.querySelector('.trip-main__trip-controls');
const statisticsContainerElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, offersModel, filtersModel, api);
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

const setNewEventButtonClickHandler = () => {
  document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });
};

siteMenuView.setMenuClickHandler(handleMenuClick);

tripPresenter.init();

api
  .getDestinations()
  .then((destinations) => destinationsModel.setDestinations(destinations))
  .then(() => api.getOffers())
  .then((offers) => offersModel.setOffers(offers))
  .then(() => api.getEvents())
  .then((events) => {
    eventsModel.setEvents(UpdateTypes.INIT, events);
    filtersPresenter.init();
    render(menuContainerElement, siteMenuView, 'beforeend');

    setNewEventButtonClickHandler();

  })
  .catch(() => {
    eventsModel.setEvents(UpdateTypes.INIT, []);
    filtersPresenter.init();
    render(menuContainerElement, siteMenuView, 'beforeend');

    setNewEventButtonClickHandler();
  });

