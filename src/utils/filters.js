import { FilterType } from '../consts.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export const filters = {
  [FilterType.ALL]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = dayjs(new Date());
      const dateFrom = dayjs(eventInfo.dateFrom);
      const dateTo = dayjs(eventInfo.dateTo);

      return dateFrom.isSameOrAfter(currentDate, 'day') || (dateFrom.isBefore(currentDate, 'day') && dateTo.isAfter(currentDate, 'day'));
    });
  },
  [FilterType.PAST]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = dayjs(new Date());
      const dateFrom = dayjs(eventInfo.dateFrom);
      const dateTo = dayjs(eventInfo.dateTo);

      return dateTo.isBefore(currentDate, 'day') || (dateFrom.isBefore(currentDate, 'day') && dateTo.isAfter(currentDate, 'day'));
    });
  },
};
