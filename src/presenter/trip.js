import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import EventPresenter from './event.js';
import { render } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { sortByPrice, sortByTime } from '../utils/events.js';
import { SortTypes } from '../consts.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class TripPresenter {
  constructor() {
    this._eventPresenters = {};
    this._sortingPanelComponent = new SortingPanelView();
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();
    this._currentSortType = SortTypes.DEFAULT;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

  }

  init(events, offersFullList, destinationsFullList) {
    this._events = [...events];
    this._defaultSortedEvents = [...events];
    this._offersFullList = [...offersFullList];
    this._destinationsFullList = [...destinationsFullList];
    this._tripInfoComponent = new TripInfoView(events);
    this._tripCostComponent = new TripCostView(events);

    this._renderSort();
    this._renderTripInfo();
    this._renderTripCost();

    (Object.keys(this._events).length === 0) ? this._renderEmptyList() : this._renderEvents();
  }

  _renderEvent(eventItem) {
    const eventPresenter = new EventPresenter(this._handleEventChange, this._handleModeChange);
    eventPresenter.init(eventItem);
    this._eventPresenters[eventItem.id] = eventPresenter;
  }

  _renderEvents() {
    this._events.forEach((eventItem) => this._renderEvent(eventItem));
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortTypes.DEFAULT:
        this._events = [...this._defaultSortedEvents];
        break;
      case SortTypes.TIME:
        this._events.sort(sortByTime);
        break;
      case SortTypes.PRICE:
        this._events.sort(sortByPrice);
        break;
    }
    this._currentSortType = sortType;
  }

  _renderEmptyList() {
    render(eventListElement, this._EmptyListPlaceholderComponent, 'beforebegin');
  }

  _renderSort() {
    render(sortingElement, this._sortingPanelComponent, 'afterbegin');
    this._sortingPanelComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripInfo() {
    render(tripInfoElement, this._tripInfoComponent, 'afterbegin');
  }

  _renderTripCost() {
    render(tripInfoElement, this._tripCostComponent, 'beforeend');
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._defaultSortedEvents = updateItem(this._defaultSortedEvents, updatedEvent);
    this._eventPresenters[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTasks(sortType);
    this._clearEventList();
    this._renderEvents();
  }

  _clearEventList() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
  }
}
