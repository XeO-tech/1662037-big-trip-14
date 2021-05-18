import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { defineDateTimeFormats } from '../utils/events.js';
import AbstractView from './abstract.js';
dayjs.extend(duration);

const createOffersTemplate = (offers) => {
  const renderedOffers = offers.map((offer) => {
    return `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;
  });
  return (renderedOffers.length > 0) ? renderedOffers.join('') : '';
};

const createEventItemTemplate = (eventInfo) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers,
    isFavorite,
  } = eventInfo;

  const eventDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const { durationFormat, dateTimeFormat } = defineDateTimeFormats(eventDuration);

  const startDayFormatted = dayjs(dateFrom).format('DD MMM');
  const dateFromFormatted = dayjs(dateFrom).format(dateTimeFormat);
  const dateToFormatted = dayjs(dateTo).format(dateTimeFormat);
  const eventDurationFormatted = eventDuration.format(durationFormat);

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active': '';

  const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFrom}">${startDayFormatted}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${typeFormatted} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${dateFromFormatted}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo}">${dateToFormatted}</time>
      </p>
      <p class="event__duration">${eventDurationFormatted}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOffersTemplate(offers)}
    </ul>
    <button class="event__favorite-btn ${favoriteClassName}" type="button">
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

export default class EventItem extends AbstractView {
  constructor(eventInfo) {
    super();
    this._eventInfo = eventInfo;

    this._arrowClickHandler = this._arrowClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventItemTemplate(this._eventInfo);
  }

  removeElement() {
    this._element = null;
  }

  _arrowClickHandler() {
    this._callback.arrowClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setArrowClickHandler(callback) {
    this._callback.arrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._arrowClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
