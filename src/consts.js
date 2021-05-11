export const eventTypes = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const cities = ['Los Angeles', 'San Francisco', 'Las Vegas'];

export const SortTypes = {
  DEFAULT: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const UserActions = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateTypes = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterTypes = {
  ALL: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItems = {
  TABLE: 'Table',
  STATS: 'Stats',
};
