import { FilterTypes } from '../consts.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export const filters = {
  [FilterTypes.FUTURE]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = dayjs(new Date());
      return dayjs(eventInfo.date_from).isSameOrAfter(currentDate, 'day');
    });
  },
  [FilterTypes.PAST]: (events) => {
    return events.filter((eventInfo) => {
      const currentDate = new dayjs(new Date());
      return dayjs(eventInfo.date_to).isBefore(currentDate, 'day');
    });
  },
};
