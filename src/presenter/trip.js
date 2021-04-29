import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import EventPresenter from './event.js';
import { render } from '../utils/render.js';
import { sortByPrice, sortByTime } from '../utils/events.js';
import { SortTypes } from '../consts.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class TripPresenter {
  constructor(eventsModel) {
    this._eventPresenters = {};
    this._eventsModel = eventsModel;
    this._sortingPanelComponent = new SortingPanelView();
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();
    this._currentSortType = SortTypes.DEFAULT;

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(offersFullList, destinationsFullList) {
    this._offersFullList = [...offersFullList];
    this._destinationsFullList = [...destinationsFullList];
    this._destinationNames = [];
    this._destinationsFullList.forEach((destination) => this._destinationNames.push(destination.name));

    this._tripInfoComponent = new TripInfoView(this._getEvents());
    this._tripCostComponent = new TripCostView(this._getEvents());

    this._renderSort();
    this._renderTripInfo();
    this._renderTripCost();

    (Object.keys(this._getEvents()).length === 0) ? this._renderEmptyList() : this._renderEvents();
  }

  _renderEvent(eventItem) {
    const eventPresenter = new EventPresenter(this._handleEventChange, this._handleModeChange);
    eventPresenter.init(eventItem, this._offersFullList, this._destinationsFullList, this._destinationNames);
    this._eventPresenters[eventItem.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().forEach((eventItem) => this._renderEvent(eventItem));
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortTypes.TIME:
        return this._eventsModel.getEvents().slice().sort(sortByTime);
      case SortTypes.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
    }
    return this._eventsModel.getEvents();
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
    // Здесь будет вызываться обновление модели
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
    this._currentSortType = sortType;
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
