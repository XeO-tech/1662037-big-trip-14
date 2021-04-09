import dayjs from 'dayjs';

const sortByDateAscending = (a, b) => new Date(a) - new Date(b);
const sortByDateDescending = (a, b) => new Date(b) - new Date(a);

const generateTripRoute = (events) => {
  const eventsSortedByStartDate = [...events].sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
  const routeSet = new Set (eventsSortedByStartDate.map((element) => element.destination.name));

  return Array.from(routeSet).join(' &mdash; ');
};

const generateTripDates = (events) => {
  const startDate = events.map((element) => element.date_from).sort(sortByDateAscending)[0];
  const endDate =  events.map((element) => element.date_to).sort(sortByDateDescending)[0];
  const endDateFormat = dayjs(startDate).month() === dayjs(endDate).month() ? 'DD' : 'MMM DD';

  return `${dayjs(startDate).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(endDate).format(endDateFormat)}`;
};

export const createTripInfoTemplate = (events) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${generateTripRoute(events)}</h1>
  <p class="trip-info__dates">${generateTripDates(events)}</p>
</div>`;
};

