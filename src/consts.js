export const EventTypes = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const SortType = {
  DEFAULT: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};
