import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const renderOffers = (offers) => {
  const renderedOffers = offers.map((offer) => {
    return `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;
  });
  return (renderedOffers.length > 0) ? renderedOffers.join('') : '';
};

const defineEventDuration = (startDate, endDate) => {
  dayjs.extend(duration);
  return dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));
};

const defineEventDurationFormats = (datesDifference) => {
  switch (true) {
    case datesDifference.days() > 0:
      return {
        durationFormat: 'DD[D] HH[H] mm[M]',
        timeRangeFormat: 'DD/MM/YY HH:mm',
      };
    case datesDifference.days() === 0 && datesDifference.hours() > 0:
      return {
        durationFormat: 'HH[H] mm[M]',
        timeRangeFormat: 'HH:mm',
      };
    default:
      return {
        durationFormat: 'mm[M]',
        timeRangeFormat: 'HH:mm',
      };
  }
};

export const createEventItemTemplate = (event) => {
  const { type, destination, startDate, endDate, cost, offers, isFavorite } = event;
  const datesDifference = defineEventDuration(startDate, endDate);
  const { durationFormat, timeRangeFormat } = defineEventDurationFormats(datesDifference);
  const day = dayjs(startDate).format('DD MMM');
  const startTime = dayjs(startDate).format(timeRangeFormat);
  const endTime = dayjs(endDate).format(timeRangeFormat);
  const eventDuration = datesDifference.format(durationFormat);
  const favorite = isFavorite ? ' event__favorite-btn--active': '';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${startDate}">${day}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${startDate}">${startTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${endDate}">${endTime}</time>
      </p>
      <p class="event__duration">${eventDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${cost}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${renderOffers(offers)}
    </ul>
    <button class="event__favorite-btn${favorite}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;
};
