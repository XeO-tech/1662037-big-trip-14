import dayjs from 'dayjs';
import { EventTypes } from '../consts.js';

export const defineDateTimeFormats = (eventDuration) => {
  switch (true) {
    case eventDuration.days() > 0:
      return {
        durationFormat: 'DD[D] HH[H] mm[M]',
        dateTimeFormat: 'DD/MM/YY HH:mm',
      };
    case eventDuration.days() === 0 && eventDuration.hours() > 0:
      return {
        durationFormat: 'HH[H] mm[M]',
        dateTimeFormat: 'HH:mm',
      };
    default:
      return {
        durationFormat: 'mm[M]',
        dateTimeFormat: 'HH:mm',
      };
  }
};

export const sortByPrice = (a, b) => b.base_price - a.base_price;

export const sortByTime = (a, b) => {
  const aEventDuration = dayjs.duration(dayjs(a.date_to).diff(dayjs(a.date_from)));

  const bEventDuration = dayjs.duration(dayjs(b.date_to).diff(dayjs(b.date_from)));

  return bEventDuration.asMilliseconds() - aEventDuration.asMilliseconds();
};

export const sortByStartDate = (a, b) => a.date_from - b.date_from;

export const sortByDateAscending = (a, b) => new Date(a) - new Date(b);

export const sortByDateDescending = (a, b) => new Date(b) - new Date(a);

export const sortEventsByStartDateAscending = (events) => [...events].sort((a, b) => sortByDateAscending(a.date_from, b.date_from));

export const sortDataAndLabels = (events, calculateData) => {
  const sortedData = [], sortedLabels = [];

  const data = EventTypes.map((type) => {
    const eventsForType = events.filter((eventInfo) => eventInfo.type === type);
    return calculateData(eventsForType);
  });

  const sortedDataWithLabels = EventTypes
    .map((label, index) => {
      return {
        label: label.toUpperCase(),
        data: data[index],
      };
    })
    .sort((a, b) => b.data - a.data);

  sortedDataWithLabels.forEach((dataAndLabel) => {
    sortedData.push(dataAndLabel.data);
    sortedLabels.push(dataAndLabel.label);
  });

  return {
    sortedData,
    sortedLabels,
  };
};
