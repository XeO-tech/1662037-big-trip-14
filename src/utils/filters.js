import { FilterTypes } from '../consts.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export const filters = {
  [FilterTypes.ALL]: (events) => events.slice(),
  [FilterTypes.FUTURE]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = dayjs(new Date());
      return dayjs(eventInfo.dateFrom).isSameOrAfter(currentDate, 'day');
    });
  },
  [FilterTypes.PAST]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = new dayjs(new Date());
      return dayjs(eventInfo.dateTo).isBefore(currentDate, 'day');
    });
  },
};
