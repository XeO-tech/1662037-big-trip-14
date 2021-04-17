import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import { render } from '../utils/render.js';
import EventPresenter from './event.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class TripPresenter {
  constructor() {
    this._sortingPanelComponent = new SortingPanelView();
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();
  }

  init(events) {
    this._events = [...events];
    this._tripInfoComponent = new TripInfoView(events);
    this._tripCostComponent = new TripCostView(events);

    this._renderSort();
    this._renderTripInfo();
    this._renderTripCost();

    (Object.keys(this._events).length === 0) ? this._renderEmptyList() : this._renderEvents();
  }

  _renderEvent(eventItem) {
    const eventPresenter = new EventPresenter();
    eventPresenter.init(eventItem);
    eventPresenter.init({...eventItem, base_price: 111});

  }

  _renderEvents() {
    this._events.forEach((eventItem) => this._renderEvent(eventItem));
  }

  _renderEmptyList() {
    render(eventListElement, this._EmptyListPlaceholderComponent, 'beforebegin');
  }

  _renderSort() {
    render(sortingElement, this._sortingPanelComponent, 'afterbegin');
  }

  _renderTripInfo() {
    render(tripInfoElement, this._tripInfoComponent, 'afterbegin');
  }

  _renderTripCost() {
    render(tripInfoElement, this._tripCostComponent, 'beforeend');
  }
}
