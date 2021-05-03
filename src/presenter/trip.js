import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import EventPresenter from './event.js';
import { remove, render } from '../utils/render.js';
import { sortByPrice, sortByTime, sortByStartDate } from '../utils/events.js';
import { SortTypes, UserActions, UpdateTypes } from '../consts.js';
import { filters } from '../utils/filters.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class TripPresenter {
  constructor(eventsModel, filtersModel) {
    this._eventPresenters = {};
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._sortingPanelComponent = null;
    this._EmptyListPlaceholderComponent = null;
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();

    this._currentSortType = SortTypes.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
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
    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();

    const filteredEvents = filters[filterType](events);

    switch (this._currentSortType) {
      case SortTypes.TIME:
        return filteredEvents.sort(sortByTime);
      case SortTypes.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
    return filteredEvents.sort(sortByStartDate);
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
      case UserActions.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserActions.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserActions.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this._eventPresenters[data.id].init(data);
        break;
      // При смене фильтра или переключении с экрана со списком точек маршрута на экран статистики и обратно сортировка сбрасывается на состояние «Day». Информация о поездке не перерисовывается
      case UpdateTypes.MINOR:
        this._clearBoard({resetSortType: true}, {resetTripInfo: false});
        this._renderBoard({resetTripInfo: false});
        break;
      // При добавлении, изменении, удалеении события перерисовываем всю доску и информацию о поездке
      case UpdateTypes.MAJOR:
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
