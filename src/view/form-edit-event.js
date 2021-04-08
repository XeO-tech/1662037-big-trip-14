import { eventTypes } from '../consts.js';
import dayjs from 'dayjs';

const renderTypesMenu = (currentType) => {
  return eventTypes
    .map((type) => {
      const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);
      return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeFormatted}</label>
      </div>`;
    })
    .join('');
};

const renderOffers = (offers) => {
  let counter = 0;
  return offers
    .map((offer) => {
      const offerShortCut = offer.title.toLowerCase().replace(/\s+/g, '');
      counter++;
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerShortCut}-${counter}" type="checkbox" name="event-offer-${offerShortCut}" checked>
      <label class="event__offer-label" for="event-offer-${offerShortCut}-${counter}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
    })
    .join('');
};

const renderPhotos = (photosUrls) => {
  return photosUrls
    .map((url) => {
      return `<img class="event__photo" src="${url}" alt="Event photo">`;
    })
    .join('');
};

export const createEditEventFormTemplate = (event = {}) => {
  const { type = 'flight', destination, startDateTime, endDateTime, cost = '', destinationInfo, offers} = event;
  const startDateTimeFormatted = dayjs(startDateTime).format('DD/MM/YY HH:mm');
  const endDateTimeFormatted = dayjs(endDateTime).format('DD/MM/YY HH:mm');

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${renderTypesMenu(type)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateTimeFormatted}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateTimeFormatted}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${renderOffers(offers)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationInfo.description}</p>
        <div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${renderPhotos(destinationInfo.photos)}
                      </div>
                    </div>
      </section>
    </section>
  </form>
</li>`;
};

