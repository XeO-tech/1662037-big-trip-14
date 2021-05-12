import FilterView from '../view/filters.js';
import { render, replace, remove } from '../utils/render.js';
import { FilterTypes, UpdateTypes } from '../consts.js';
import { filters } from '../utils/filters.js';

export default class Filters {
  constructor(filtersModel, eventsModel) {
    this._filtersModel = filtersModel;
    this._filtersContainerElement = document.querySelector('.trip-controls__filters');
    this._eventsModel = eventsModel;

    this._filtersComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new FilterView(filters, this._filtersModel.getFilter());
    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainerElement, this._filtersComponent, 'beforeend');
      return;
    }

    replace(this._filtersComponent, prevFiltersComponent);
    remove (prevFiltersComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateTypes.MINOR, filterType);
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();

    return [
      {
        type: FilterTypes.ALL,
        name: 'Everything',
        active: events.length !== 0,
      },
      {
        type: FilterTypes.FUTURE,
        name: 'Future',
        active: filters[FilterTypes.FUTURE](events).length !== 0,
      },
      {
        type: FilterTypes.PAST,
        name: 'Past',
        active: filters[FilterTypes.PAST](events).length !== 0,
      },
    ];
  }
}
