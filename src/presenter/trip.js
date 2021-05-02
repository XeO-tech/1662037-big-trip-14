import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import EventPresenter from './event.js';
import { remove, render } from '../utils/render.js';
import { sortByPrice, sortByTime } from '../utils/events.js';
import { SortTypes, UserAction, UpdateType } from '../consts.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class TripPresenter {
  constructor(eventsModel) {
    this._eventPresenters = {};
    this._eventsModel = eventsModel;
    this._sortingPanelComponent = null;
    this._EmptyListPlaceholderComponent = null;
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();

    this._currentSortType = SortTypes.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(offersFullList, destinationsFullList) {
    this._offersFullList = [...offersFullList];
    this._destinationsFullList = [...destinationsFullList];
    this._destinationNames = [];
    this._destinationsFullList.forEach((destination) => this._destinationNames.push(destination.name));

    this._renderBoard();
  }

  _renderEvent(eventItem) {
    const eventPresenter = new EventPresenter(this._handleViewAction, this._handleModeChange);
    eventPresenter.init(eventItem, this._offersFullList, this._destinationsFullList, this._destinationNames);
    this._eventPresenters[eventItem.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().forEach((eventItem) => this._renderEvent(eventItem));
  }

  _renderBoard({resetTripInfo = true} = {}) {
    if (Object.keys(this._getEvents()).length === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderSort();
    this._renderEvents();

    if (resetTripInfo) {
      this._renderTripInfo();
      this._renderTripCost();
    }
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
    if (this._sortingPanelComponent !== null) {
      this._sortingPanelComponent = null;
    }

    this._sortingPanelComponent = new SortingPanelView(this._currentSortType);

    this._sortingPanelComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(sortingElement, this._sortingPanelComponent, 'afterbegin');
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getEvents());

    render(tripInfoElement, this._tripInfoComponent, 'afterbegin');
  }

  _renderTripCost() {
    if (this._tripCostComponent !== null) {
      this._tripCostComponent = null;
    }

    this._tripCostComponent = new TripCostView(this._getEvents());

    render(tripInfoElement, this._tripCostComponent, 'beforeend');
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].init(data);
        break;
      // При смене фильтра или переключении с экрана со списком точек маршрута на экран статистики и обратно сортировка сбрасывается на состояние «Day». Информация о поездке не перерисовывается
      case UpdateType.MINOR:
        this._clearBoard({resetSortType: true}, {resetTripInfo: false});
        this._renderBoard({resetTripInfo: false});
        break;
      // При добавлении, изменении, удалеении события перерисовываем всю доску и информацию о поездке
      case UpdateType.MAJOR:
        this._clearBoard();
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _clearEventList() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
  }

  _clearBoard({resetSortType = false, resetTripInfo = true} = {}) {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
    remove(this._sortingPanelComponent);
    remove(this._EmptyListPlaceholderComponent);

    if (resetTripInfo) {
      remove(this._tripCostComponent);
      remove(this._tripInfoComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortTypes.DEFAULT;
    }
  }
}
