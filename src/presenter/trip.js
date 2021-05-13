import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import EventPresenter from './event.js';
import NewEventPresenter from './event-new.js';
import { remove, render } from '../utils/render.js';
import { sortByPrice, sortByTime, sortByStartDate } from '../utils/events.js';
import { SortTypes, UserActions, UpdateTypes, FilterTypes } from '../consts.js';
import { filters } from '../utils/filters.js';

export default class TripPresenter {
  constructor(eventsModel, destinationsModel, offersModel, filtersModel) {
    this._eventPresenters = {};
    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._filtersModel = filtersModel;
    this._sortingPanelComponent = null;
    this._EmptyListPlaceholderComponent = null;
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();

    this.tripInfoContainerElement = document.querySelector('.trip-main__trip-info');
    this.sortingContainerElement = document.querySelector('.trip-events');
    this.eventListContainerElement = document.querySelector('.trip-events__list');

    this._currentSortType = SortTypes.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = new NewEventPresenter(this._handleViewAction);
  }

  init() {
    this._destinationsFullList = this._destinationsModel.getDestinations();
    this._offersFullList = this._offersModel.getOffers();
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
    render(this.eventListContainerElement, this._EmptyListPlaceholderComponent, 'beforebegin');
  }

  _renderSort() {
    if (this._sortingPanelComponent !== null) {
      this._sortingPanelComponent = null;
    }

    this._sortingPanelComponent = new SortingPanelView(this._currentSortType);

    this._sortingPanelComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this.sortingContainerElement, this._sortingPanelComponent, 'afterbegin');
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getEvents());

    render(this.tripInfoContainerElement, this._tripInfoComponent, 'afterbegin');
  }

  _renderTripCost() {
    if (this._tripCostComponent !== null) {
      this._tripCostComponent = null;
    }

    this._tripCostComponent = new TripCostView(this._getEvents());

    render(this.tripInfoContainerElement, this._tripCostComponent, 'beforeend');
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();
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
        this._eventPresenters[data.id].init(data, this._offersFullList, this._destinationsFullList, this._destinationNames);
        break;
      // При смене фильтра или переключении с экрана со списком точек маршрута на экран статистики и обратно сортировка сбрасывается на состояние «Day». Информация о поездке не перерисовывается
      case UpdateTypes.MINOR:
        this._clearBoard({resetSortType: true, resetTripInfo: false});
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
    this._clearBoard({resetTripInfo: false});
    this._renderBoard({resetTripInfo: false});
  }

  _clearBoard({resetSortType = false, resetTripInfo = true} = {}) {
    this._newEventPresenter.destroy();
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

  createEvent() {
    this._filtersModel.setFilter(UpdateTypes.MINOR, FilterTypes.ALL);
    this._newEventPresenter.init(this._offersFullList, this._destinationsFullList, this._destinationNames);
  }

  hideElement() {
    this.eventListContainerElement.classList.add('visually-hidden');
    this._sortingPanelComponent.getElement().classList.add('visually-hidden');

    const elementsWithLine = [...document.querySelectorAll('.page-body__container')];
    elementsWithLine.forEach((element) => {
      element.classList.add('page-body__container-no-after');
      element.classList.remove('page-body__container');
    });
  }

  showElement() {
    this.eventListContainerElement.classList.remove('visually-hidden');
    this._sortingPanelComponent.getElement().classList.remove('visually-hidden');

    const elementsWithoutLine = [...document.querySelectorAll('.page-body__container-no-after')];
    elementsWithoutLine.forEach((element) => {
      element.classList.add('page-body__container');
      element.classList.remove('page-body__container-no-after');
    });
  }
}
