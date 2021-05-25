import Api from './api/api.js';
import EventsModel from './model/events.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FiltersModel from './model/filters.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { render, remove, RenderPosition } from './utils/render.js';
import { MenuItem, UpdateType, FilterType } from './consts.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';

const AUTHORIZATION = 'Basic 3424nklfsdl1mcs';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const menuContainerElement = document.querySelector('.trip-main__trip-controls');
const mainContainerElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, offersModel, filtersModel, apiWithProvider);
const filtersPresenter = new FiltersPresenter(filtersModel, eventsModel);

let statisticsView = null;

const handleMenuClick = (target) => {
  switch (target) {
    case MenuItem.TABLE:
      filtersModel.setFilter(UpdateType.MINOR, FilterType.ALL);
      remove(statisticsView);
      tripPresenter.showElement();
      break;
    case MenuItem.STATS:
      statisticsView = new StatisticsView(eventsModel.getEvents());
      tripPresenter.hideElement();
      render(mainContainerElement, statisticsView, RenderPosition.BEFOREEND);
      break;
  }
};

const setNewEventButtonClickHandler = () => {
  newEventButtonElement.addEventListener('click', () => {
    if (!isOnline()) {
      toast('You can\'t create new event offline');
      return;
    }
    tripPresenter.createEvent();
  });
};

const setupInterface = () => {
  filtersPresenter.init();
  render(menuContainerElement, siteMenuView, RenderPosition.BEFOREEND);
  siteMenuView.setMenuClickHandler(handleMenuClick);
  newEventButtonElement.disabled = false;
  setNewEventButtonClickHandler();
};

newEventButtonElement.disabled = true;
tripPresenter.init();

api
  .getDestinations()
  .then((destinations) => destinationsModel.setDestinations(destinations))
  .then(() => api.getOffers())
  .then((offers) => offersModel.setOffers(offers))
  .then(() => api.getEvents())
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    setupInterface();
  })
  .catch((err) => {
    if (err === 'offers' || err === 'destinations') {
      tripPresenter.renderError();
      return;
    }
    eventsModel.setEvents(UpdateType.INIT, []);
    setupInterface();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
