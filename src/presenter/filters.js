import FilterView from '../view/filters.js';
import { render, replace, remove, RenderPosition } from '../utils/render.js';
import { FilterType, UpdateType } from '../consts.js';
import { filters } from '../utils/filters.js';

export default class FiltersPresenter {
  constructor(filtersModel, eventsModel) {
    this._filtersContainerElement = document.querySelector('.trip-controls__filters');

    this._filtersModel = filtersModel;
    this._eventsModel = eventsModel;
    this._filtersView = null;


    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersView = this._filtersView;

    this._filtersView = new FilterView(filters, this._filtersModel.getFilter());
    this._filtersView.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFiltersView === null) {
      render(this._filtersContainerElement, this._filtersView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filtersView, prevFiltersView);
    remove (prevFiltersView);
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.ALL,
        name: 'Everything',
        isActive: events.length !== 0,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isActive: filters[FilterType.FUTURE](events).length !== 0,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isActive: filters[FilterType.PAST](events).length !== 0,
      },
    ];
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MINOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
