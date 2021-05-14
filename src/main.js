import EventsModel from './model/events.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FiltersModel from './model/filters.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPesenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import { generateEvents, offersFullList, destinationsFullList } from './mocks/events.js';
import { render, remove } from './utils/render.js';
import { MenuItems, UpdateTypes, FilterTypes } from './consts.js';
import Api from './api.js';

const EVENT_NUMBERS = 20;
const AUTHORIZATION = 'Basic 3424nklfsdl1mcs';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const events = generateEvents(EVENT_NUMBERS);
const api = new Api(END_POINT, AUTHORIZATION);

api.getEvents().then((events) => {

  // base_price: 600
  // date_from: "2021-05-12T23:22:24.436Z"
  // date_to: "2021-05-13T06:23:23.729Z"
  // destination:
  // description: "Rome, with crowded streets, in a middle of Europe, for those who value comfort and coziness."
  // name: "Rome"
  // pictures: (4) [{…}, {…}, {…}, {…}]
  // id: "0"
  // is_favorite: true
  // offers: Array(2)
  // 0: {title: "Choose the time of check-in", price: 70}
  // 1: {title: "Add breakfast", price: 110}
});
// api.getDestinations().then((destinations) => console.log(destinations));
// api.getOffers().then((offers) => console.log(offers));



const menuContainerElement = document.querySelector('.trip-main__trip-controls');
const statisticsContainerElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const siteMenuView = new SiteMenuView();
const tripPresenter = new TripPesenter(eventsModel, destinationsModel, offersModel, filtersModel);
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
offersModel.setOffers(offersFullList);

render(menuContainerElement, siteMenuView, 'beforeend');
siteMenuView.setMenuClickHandler(handleMenuClick);

tripPresenter.init();
filtersPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

