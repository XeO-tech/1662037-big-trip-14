import Observer from '../utils/observer.js';
import { FilterType } from '../consts.js';

export default class Filters extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }
}
