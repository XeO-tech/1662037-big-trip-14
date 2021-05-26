import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, isActive} = filter;
  const nameFormatted = name.toLowerCase();

  return `<div class="trip-filters__filter">
  <input id="filter-${nameFormatted}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${nameFormatted}" ${currentFilterType === type ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
  <label class="trip-filters__filter-label" for="filter-${nameFormatted}">${name}</label>
</div>`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return `<form class="trip-filters" action="#" method="get">
  ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}

