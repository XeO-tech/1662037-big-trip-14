import dayjs from 'dayjs';
import { sortByDateAscending, sortByDateDescending } from '../utils.js';


const generateTripRoute = (events) => {
  const eventsSortedByStartDate = [...events].sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
  const uniqueDestinations = new Set (eventsSortedByStartDate.map((element) => element.destination.name));

  return Array.from(uniqueDestinations).join(' &mdash; ');

  // Код выше выводит уникальные пункты назначения из всего массива, отсортированние в порядке посещени. Он не учитывает случаи, когда в место возвращаются после посещения другого. Нижестоящий код учитывает это, но плохо подходит для тестовых данных, так как они хаотичны и в итоге приводят к длинному маршруту. Когда перейдем на использование серверных данных и сможем добавлять свои точки, тогда перейду на ниженаписанный код.

  // const destinationsSortedByDate = eventsSortedByStartDate.map((element) => element.destination.name);
  // const uniqueDestinations = [];
  // for (let i = 0; i < destinationsSortedByDate.length; i++) {
  //   if (destinationsSortedByDate[i] !== destinationsSortedByDate[i + 1]) {
  //     uniqueDestinations.push(destinationsSortedByDate[i]);
  //   }
  // }
  // return uniqueDestinations.join(' &mdash; ');
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

