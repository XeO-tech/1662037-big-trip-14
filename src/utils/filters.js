import { FilterTypes } from '../consts.js';

export const filters = {
  [FilterTypes.FUTURE]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = new Date(Date.now());
      return eventInfo.date_from >= currentDate;
    });
  },
  [FilterTypes.PAST]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = new Date(Date.now());
      return eventInfo.date_to < currentDate;
    });
  },
};
