import { createElement } from '../utils.js';
import { eventTypes, cities } from '../consts.js';
import dayjs from 'dayjs';

const BLANK_EVENT = {
  type: 'flight',
  destination,
  date_from: null,
  date_to:  null,
  base_price: '',
  offers = null,
}

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

const renderDestinationsOptions = () => {
  return cities
    .map((city) => `<option value="${city}"></option>`)
    .join();
};

const renderOffers = (offers) => {
  let counter = 0;
  return offers
    .map((offer) => {
      const offerShortCut = offer.title.toLowerCase().replace(/\s+/g, '_');
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

const renderPhotos = (pictures) => {
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="Event photo">`;
    })
    .join('');
};

const createAddAndEditFormTemplate = (eventInfo = {}) => {
  const isAddNewEventForm = Object.keys(eventInfo).length === 0;
  const {
    type = 'flight',
    destination,
    date_from: startDateTime = null,
    date_to: endDateTime = null,
    base_price: basePrice = '',
    offers = null,
  } = eventInfo;
  const startDateTimeFormatted = startDateTime === null ? '' : dayjs(startDateTime).format('DD/MM/YY HH:mm');
  const endDateTimeFormatted = endDateTime === null ? '' : dayjs(endDateTime).format('DD/MM/YY HH:mm');
  const offersClassName = offers === null || offers.length === 0 ? 'visually-hidden' : '';
  const destinationClassName = isAddNewEventForm || Object.keys(destination).length === 0 ? 'visually-hidden' : '';

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isAddNewEventForm ? '' : destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${renderDestinationsOptions()}
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isAddNewEventForm ? 'Cancel' : 'Delete'}</button>
      ${isAddNewEventForm ? '' : `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers ${offersClassName}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${isAddNewEventForm ? '' : renderOffers(offers)}
        </div>
      </section>
      <section class="event__section  event__section--destination ${destinationClassName}">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${isAddNewEventForm ? '' : destination.description}</p>
        <div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${isAddNewEventForm ? '': renderPhotos(destination.pictures)}
                      </div>
                    </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class AddAndEditForm {
  constructor(eventInfo) {
    this._element = null;
    this._eventInfo = eventInfo;
  }
  getTemplate() {
    return createAddAndEditFormTemplate(this._eventInfo);
  }
  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}

