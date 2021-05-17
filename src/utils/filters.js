import { FilterType } from '../consts.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export const filters = {
  [FilterType.ALL]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = dayjs(new Date());
      return dayjs(eventInfo.dateFrom).isSameOrAfter(currentDate, 'day');
    });
  },
  [FilterType.PAST]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = new dayjs(new Date());
      return dayjs(eventInfo.dateTo).isBefore(currentDate, 'day');
    });
  },
};
