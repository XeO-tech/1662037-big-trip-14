import SmartView from './smart.js';
import { eventTypes } from '../consts.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

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

const renderDestinationsOptions = (avaliableDestinations) => {
  return avaliableDestinations
    .map((destination) => `<option value="${destination}"></option>`)
    .join('');
};

const renderOffers = (offers, areOffersChecked) => {
  if (offers.length === 0) {
    return '';
  }
  let counter = 0;
  return offers
    .map((offer) => {
      const offerShortCut = offer.title.toLowerCase().replace(/\s+/g, '_');
      counter++;
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerShortCut}-${counter}" type="checkbox" name="event-offer-${offerShortCut}" ${areOffersChecked ? 'checked': ''}>
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
  if (pictures.length === 0) {
    return '';
  }
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="Event photo">`;
    })
    .join('');
};

const createAddAndEditFormTemplate = (eventInfo = {}) => {
  const {
    type = 'flight',
    destination,
    date_from: startDateTime = null,
    date_to: endDateTime = null,
    base_price: basePrice = '',
    offers = null,
    avaliableDestinations,
    areOffersChecked,
    isAddNewEventForm,
  } = eventInfo;

  const startDateTimeFormatted = startDateTime === null ? '' : dayjs(startDateTime).format('DD/MM/YY HH:mm');
  const endDateTimeFormatted = endDateTime === null ? '' : dayjs(endDateTime).format('DD/MM/YY HH:mm');

  const offersClassName = offers === null || offers.length === 0 ? 'visually-hidden' : '';

  const destinationClassName = isAddNewEventForm || (destination.description.length === 0 && destination.pictures.length === 0) ? 'visually-hidden' : '';

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
          ${renderDestinationsOptions(avaliableDestinations)}
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
          ${isAddNewEventForm ? '' : renderOffers(offers, areOffersChecked)}
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

export default class AddAndEditForm extends SmartView {
  constructor(eventInfo, offersFullList, destinationFullList, destinationNames) {
    super();
    this._offersFullList = offersFullList;
    this._destinationsFullList = destinationFullList;
    this._destinationNames = destinationNames;
    this._startDatePicker = null;
    this._endDatePicker = null;
    this._data = this.parseEventInfoToData(eventInfo);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._arrowClickHandler = this._arrowClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createAddAndEditFormTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _arrowClickHandler() {
    this._callback.arrowClick();
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: this._offersFullList.find((element) => element.type === evt.target.value).offers,
      areOffersChecked: false,
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    let newData;
    const newDestination = this._destinationsFullList.find((element) => element.name === evt.target.value);

    newDestination === undefined ?
      newData = {
        destination: {
          name: evt.target.value,
          description: '',
          pictures: [],
        },
      } :
      newData = {
        destination: newDestination,
      };

    this.updateData(newData, true);
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({date_from: userDate}, false);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({date_to: userDate}, false);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
  }

  _setDatePicker() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._startDatePicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._data.date_from,
        onChange: this._startDateChangeHandler,
        enableTime: true,
      },
    );

    this._endDatePicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._data.date_to,
        onChange: this._endDateChangeHandler,
        enableTime: true,
      },
    );
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setArrowClickHandler(callback) {
    this._callback.arrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._arrowClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setSubmitHandler(this._callback.submit);
    this.setArrowClickHandler(this._callback.arrowClick);
  }

  reset(eventInfo) {
    this.updateData(this.parseEventInfoToData(eventInfo), true);
  }

  parseEventInfoToData(eventInfo) {
    return Object.assign(
      {},
      eventInfo,
      {
        avaliableDestinations: this._destinationNames,
        areOffersChecked: true,
        isAddNewEventForm: Object.keys(eventInfo).length === 0,
        // areOffersAvaliable,
        // isDescriptionAvaliable,
        // arePicturesAvaliable,
      });
  }

  parseDataToEventInfo(data) {
    data = Object.assign(
      {},
      this._data,
    );
    delete data.areOffersChecked;
    delete data.isAddNewEventForm;
    delete data.avaliableDestinations;

    return data;
  }
}

