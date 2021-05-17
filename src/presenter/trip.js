import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import LoadingView from '../view/loading.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import ErrorView from '../view/error.js';
import EventPresenter, {State as EventPresenterState} from './event.js';
import NewEventPresenter from './event-new.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sortByPrice, sortByTime, sortByStartDate } from '../utils/events.js';
import { SortType, UserAction, UpdateType, FilterType } from '../consts.js';
import { filters } from '../utils/filters.js';

export default class TripPresenter {
  constructor(eventsModel, destinationsModel, offersModel, filtersModel, api) {
    this._eventPresenters = {};
    this._isLoading = true;
    this._api = api;

    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._filtersModel = filtersModel;

    this._sortingPanelComponent = null;
    this._emptyListPlaceholderComponent = new EmptyListPlaceholderView();
    this._loadingComponent = new LoadingView();
    this._errorView = new ErrorView();


    this._tripInfoContainerElement = document.querySelector('.trip-main__trip-info');
    this._mainContainerElement = document.querySelector('.trip-events');
    this._eventListContainerElement = document.querySelector('.trip-events__list');

    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = new NewEventPresenter(this._handleViewAction);
  }

  init() {
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

  _renderLoading() {
    render(this._mainContainerElement, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  renderError() {
    remove(this._loadingComponent);
    render(this._mainContainerElement, this._errorView, RenderPosition.AFTERBEGIN);
  }

  _renderBoard({resetTripInfo = true} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._destinationsFullList = this._destinationsModel.getDestinations();
    this._destinationNames = this._destinationsModel.getCitiesNames();
    this._offersFullList = this._offersModel.getOffers();

    if (this._getEvents().length === 0 && this._filtersModel.getFilter() === FilterType.All) {
      this._renderEmptyList();
      return;
    }

    this._renderSort();
    this._renderEvents();

    if (this._getEvents().length === 0 && this._filtersModel.getFilter() !== FilterType.All) {
      this._filtersModel.setFilter(UpdateType.MINOR, FilterType.ALL);
    }

    if (resetTripInfo) {
      this._renderTripInfo();
      this._renderTripCost();
    }
  }

  _getEvents({getUnfiltered = false} = {}) {
    if (getUnfiltered) {
      return this._eventsModel.getEvents();
    }

    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();

    const filteredEvents = filters[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
    return filteredEvents.sort(sortByStartDate);
  }

  _renderEmptyList() {
    render(this._eventListContainerElement, this._emptyListPlaceholderComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderSort() {
    if (this._sortingPanelComponent !== null) {
      this._sortingPanelComponent = null;
    }

    this._sortingPanelComponent = new SortingPanelView(this._currentSortType);

    this._sortingPanelComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._mainContainerElement, this._sortingPanelComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getEvents({getUnfiltered: true}));

    render(this._tripInfoContainerElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost() {
    if (this._tripCostComponent !== null) {
      this._tripCostComponent = null;
    }

    this._tripCostComponent = new TripCostView(this._getEvents({getUnfiltered: true}));

    render(this._tripInfoContainerElement, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenters[update.id].setViewState(EventPresenterState.SAVING);
        this._api
          .updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => this._eventPresenters[update.id].setViewState(EventPresenterState.ABORTING));
        break;
      case UserAction.ADD_EVENT:
        this._newEventPresenter.setSaving();
        this._api
          .addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => this._newEventPresenter.setAborting());
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenters[update.id].setViewState(EventPresenterState.DELETING);
        this._api
          .deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => this._eventPresenters[update.id].setViewState(EventPresenterState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].init(data, this._offersFullList, this._destinationsFullList, this._destinationNames);
        break;
      // При смене фильтра или переключении с экрана со списком точек маршрута на экран статистики и обратно сортировка сбрасывается на состояние «Day». Информация о поездке не перерисовывается
      case UpdateType.MINOR:
        this._clearBoard({resetSortType: true, resetTripInfo: false});
        this._renderBoard({resetTripInfo: false});
        break;
      // При добавлении, изменении, удалении события перерисовываем всю доску и информацию о поездке
      case UpdateType.MAJOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    remove(this._emptyListPlaceholderComponent);
    remove(this._loadingComponent);

    if (resetTripInfo) {
      remove(this._tripCostComponent);
      remove(this._tripInfoComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  createEvent() {
    this._filtersModel.setFilter(UpdateType.MINOR, FilterType.ALL);
    this._newEventPresenter.init(this._offersFullList, this._destinationsFullList, this._destinationNames);
  }

  hideElement() {
    this._eventListContainerElement.classList.add('visually-hidden');
    this._sortingPanelComponent.getElement().classList.add('visually-hidden');

    const elementsWithLine = [...document.querySelectorAll('.page-body__container')];
    elementsWithLine.forEach((element) => {
      element.classList.add('page-body__container-no-after');
      element.classList.remove('page-body__container');
    });
  }

  showElement() {
    this._eventListContainerElement.classList.remove('visually-hidden');
    this._sortingPanelComponent.getElement().classList.remove('visually-hidden');

    const elementsWithoutLine = [...document.querySelectorAll('.page-body__container-no-after')];
    elementsWithoutLine.forEach((element) => {
      element.classList.add('page-body__container');
      element.classList.remove('page-body__container-no-after');
    });
  }
}
