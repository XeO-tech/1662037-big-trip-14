import dayjs from 'dayjs';
import { sortEventsByStartDateAscending, sortByDateAscending, sortByDateDescending } from '../utils/events.js';
import AbstractView from './abstract.js';

const MAX_DESTINATIONS = 3;

const createTripRouteTemplate = (events) => {
  const eventsSortedByStartDate = sortEventsByStartDateAscending(events);

  const uniqueDestinations = Array.from(new Set (eventsSortedByStartDate.map((element) => element.destination.name)));

  if (uniqueDestinations.length > MAX_DESTINATIONS) {
    const finalDestinationsList = [uniqueDestinations[0], ' ... ', uniqueDestinations[uniqueDestinations.length - 1]];

    return finalDestinationsList.join(' &mdash; ');
  }

  return uniqueDestinations.join(' &mdash; ');
};

const createTripDatesTemplate = (events) => {
  const startDate = dayjs(events
    .map((element) => element.dateFrom)
    .sort(sortByDateAscending)[0]);

  const endDate =  dayjs(events
    .map((element) => element.dateTo)
    .sort(sortByDateDescending)[0]);

  if (startDate.isSame(endDate, 'day')) {
    return `${startDate.format('MMM DD')}`;
  }

  const endDateFormat = startDate.isSame(endDate, 'month') ? 'DD' : 'MMM DD';

  return `${startDate.format('MMM DD')}&nbsp;&mdash;&nbsp;${endDate.format(endDateFormat)}`;
};

const createTripInfoTemplate = (events) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${createTripRouteTemplate(events)}</h1>
  <p class="trip-info__dates">${createTripDatesTemplate(events)}</p>
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

