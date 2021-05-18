import SmartView from './smart.js';
import { EventTypes } from '../consts.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createTypesMenuTemplate = (currentType, isDisabled) => {
  return EventTypes
    .map((type) => {
      const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);

      return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeFormatted}</label>
      </div>`;
    })
    .join('');
};

const createDestinationsOptionsTemplate = (avaliableDestinations) => {
  return avaliableDestinations
    .map((destination) => `<option value="${destination}"></option>`)
    .join('');
};

const createOffersTemplate = (offers, offersFullList, type, isDisabled) => {
  const checkedOffersTitles = offers.map((offer) => offer.title);

  const allOffersForSelectedType = offersFullList.find((offer) => offer.type === type).offers;

  return allOffersForSelectedType
    .map((offer) => {
      const offerShortCut = offer.title.toLowerCase().replace(/\s+/g, '_');

      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerShortCut}" type="checkbox" name="${offer.title}" ${offers.length === 0 ? '' : checkedOffersTitles.some((title) => title === offer.title) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offerShortCut}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
    })
    .join('');
};

const createPhotosTemplate = (pictures) => {
  if (pictures.length === 0) {
    return '';
  }
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="Event photo">`;
    })
    .join('');
};

const createAddAndEditFormTemplate = (eventInfo = {}, offersFullList) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers,
    avaliableDestinations,
    isAddNewEventForm,
    isDisabled,
    isSaving,
    isDeleting,
  } = eventInfo;

  const dateFromFormatted = dateFrom === null ? '' : dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const dateToFormatted = dateTo === null ? '' : dayjs(dateTo).format('DD/MM/YY HH:mm');

  const offersClassName = offersFullList.find((element) => element.type === type).offers.length === 0 ? 'visually-hidden' : '';

  const destinationClassName = destination === null ||(destination.description.length === 0 && destination.pictures.length === 0) ? 'visually-hidden' : '';

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
          <fieldset class="event__type-group" >
            <legend class="visually-hidden">Event type</legend>
            ${createTypesMenuTemplate(type, isDisabled)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination === null ? '' : destination.name}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${createDestinationsOptionsTemplate(avaliableDestinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromFormatted}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToFormatted}" ${isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isAddNewEventForm ? 'Cancel' : isDeleting ? 'Deleting' : 'Delete'}</button>
      ${isAddNewEventForm ? '' : `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers ${offersClassName}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersTemplate(offers, offersFullList, type, isDisabled)}
        </div>
      </section>
      <section class="event__section  event__section--destination ${destinationClassName}">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination === null || destination.description.length === 0 ? '' : destination.description}</p>
        <div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${destination === null || destination.pictures.length === 0 ? '': createPhotosTemplate(destination.pictures)}
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
    this._data = this.parseEventInfoToData(eventInfo);
    this._endDatePicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._arrowClickHandler = this._arrowClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createAddAndEditFormTemplate(this._data, this._offersFullList);
  }

  _getSelectedOffers() {
    const selectedOffersForType = [];

    const selectedOffersTitles = [...document.querySelectorAll('.event__offer-selector input[type=\'checkbox\']:checked')].map((element) => element.name);

    const allOffersForType = this._offersFullList.find((element) => element.type === this._data.type).offers;

    allOffersForType.forEach((offer, ind) => {
      selectedOffersTitles.forEach((selectedOfferTitle) => {
        if (selectedOfferTitle === offer.title) {
          selectedOffersForType.push(allOffersForType[ind]);
        }
      });
    });

    return selectedOffersForType;
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this.updateData({
      offers: this._getSelectedOffers(),
    }, false);

    this._callback.submit(this.parseDataToEventInfo(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    this._callback.delete(this.parseDataToEventInfo(this._data));
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();

    this._callback.cancel(this.parseDataToEventInfo(this._data));
  }

  _arrowClickHandler() {
    this._callback.arrowClick();
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
      offers: [],
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const newDestinationData = this._destinationsFullList.find((element) => element.name === evt.target.value);

    if (newDestinationData === undefined) {
      evt.target.setCustomValidity('Please use destinations from the list');
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');
    evt.target.reportValidity();

    this.updateData({destination: newDestinationData, offers: this._getSelectedOffers()}, true);
  }

  _startDateChangeHandler() {
    const selectedDate = arguments[0][0];
    const dateInput = arguments[2].altInput;

    if (this._data.dateTo !== undefined
      && dayjs(selectedDate).isAfter(dayjs(this._data.dateTo)))
    {
      dateInput.setCustomValidity('Start date should be prior to or the same as end date');
      dateInput.reportValidity();
      return;
    }

    dateInput.setCustomValidity('');
    dateInput.reportValidity();

    this.updateData({dateFrom: selectedDate}, false);
  }

  _endDateChangeHandler() {
    const selectedDate = arguments[0][0];
    const dateInput = arguments[2].altInput;

    if (this._data.dateFrom !== undefined
      && dayjs(this._data.dateFrom).isAfter(dayjs(selectedDate)))
    {
      dateInput.setCustomValidity('End date should be after or the same as start date');
      dateInput.reportValidity();
      return;
    }

    dateInput.setCustomValidity('');
    dateInput.reportValidity();

    this.updateData({dateTo: selectedDate}, false);
  }

  _priceChangeHandler(evt) {
    const price = Number(evt.target.value);

    evt.target.setCustomValidity('');

    if (isNaN(price) || !Number.isInteger(price)) {
      evt.target.setCustomValidity('Please, use integer number value');
    }

    evt.target.reportValidity();

    if (evt.target.validity.valid === true) {
      this.updateData({basePrice: parseInt(evt.target.value)}, false);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
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

    const flatpickrBaseSettings = {
      altInput: true,
      altFormat: 'j/m/y H:i',
      allowInput: true,
      dateFormat: 'j/m/y H:i',
      enableTime: true,
    };

    this._startDatePicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      Object.assign(
        {},
        flatpickrBaseSettings,
        {
          defaultDate: this._data.isAddNewEventForm ? new Date().toISOString() : this._data.dateFrom,
          onChange: this._startDateChangeHandler,
        }));

    this._endDatePicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      Object.assign(
        {},
        flatpickrBaseSettings,
        {
          defaultDate: this._data.isAddNewEventForm ? new Date().toISOString() : this._data.dateTo,
          onChange: this._endDateChangeHandler,
        }));

    this._startDatePicker._input.onkeydown = () => false;
    this._endDatePicker._input.onkeydown = () => false;
  }

  setArrowClickHandler(callback) {
    if (this.getElement().querySelector('.event__rollup-btn') === null) {
      return;
    }

    this._callback.arrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._arrowClickHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancel = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._cancelClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setSubmitHandler(this._callback.submit);
    this.setArrowClickHandler(this._callback.arrowClick);

    this._data.isAddNewEventForm ? this.setCancelClickHandler(this._callback.cancel) : this.setDeleteClickHandler(this._callback.delete);
  }

  reset(eventInfo) {
    this.updateData(this.parseEventInfoToData(eventInfo), true);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  parseEventInfoToData(eventInfo) {
    const  isAddNewEventForm = Object.keys(eventInfo).length === 0;

    if (isAddNewEventForm) {
      return {
        type: 'flight',
        offers: [],
        destination: null,
        basePrice: '',
        dateFrom: null,
        dateTo: null,
        avaliableDestinations: this._destinationNames,
        isAddNewEventForm,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      };
    }

    return Object.assign(
      {},
      eventInfo,
      {
        avaliableDestinations: this._destinationNames,
        isAddNewEventForm,
      });
  }

  parseDataToEventInfo(data) {
    data = Object.assign({}, data);

    if (data.isAddNewEventForm) {
      Object.assign(data, {isFavorite: false});
    }

    delete data.isAddNewEventForm;
    delete data.avaliableDestinations;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

