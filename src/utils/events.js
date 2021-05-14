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

export const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export const sortByTime = (a, b) => {
  const aEventDuration = dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom)));

  const bEventDuration = dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom)));

  return bEventDuration.asMilliseconds() - aEventDuration.asMilliseconds();
};

export const sortByStartDate = (a, b) => a.dateFrom - b.dateFrom;

export const sortByDateAscending = (a, b) => new Date(a) - new Date(b);

export const sortByDateDescending = (a, b) => new Date(b) - new Date(a);

export const sortEventsByStartDateAscending = (events) => [...events].sort((a, b) => sortByDateAscending(a.dateFrom, b.dateFrom));

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
