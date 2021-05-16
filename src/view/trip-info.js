import dayjs from 'dayjs';
import { sortEventsByStartDateAscending, sortByDateAscending, sortByDateDescending } from '../utils/events.js';
import AbstractView from './abstract.js';

const generateTripRoute = (events) => {
  const eventsSortedByStartDate = sortEventsByStartDateAscending(events);

  const uniqueDestinations = Array.from(new Set (eventsSortedByStartDate.map((element) => element.destination.name)));

  if (uniqueDestinations.length > 3) {
    const finalDestinationsList = [uniqueDestinations[0], ' ... ', uniqueDestinations[uniqueDestinations.length - 1]];

    return finalDestinationsList.join(' &mdash; ');
  }

  return uniqueDestinations.join(' &mdash; ');
};

const generateTripDates = (events) => {
  const startDate = events.map((element) => element.dateFrom).sort(sortByDateAscending)[0];
  const endDate =  events.map((element) => element.dateTo).sort(sortByDateDescending)[0];
  const endDateFormat = dayjs(startDate).month() === dayjs(endDate).month() ? 'DD' : 'MMM DD';

  return `${dayjs(startDate).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(endDate).format(endDateFormat)}`;
};

const createTripInfoTemplate = (events) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${generateTripRoute(events)}</h1>
  <p class="trip-info__dates">${generateTripDates(events)}</p>
</div>`;
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }
  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}

