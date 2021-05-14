import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = [...events];
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, updatedEvent) {
    const index = this._events.findIndex((eventItem) => eventItem.id === updatedEvent.id);

    if (index === -1) {
      throw new Error ('Can\'t update the event which is not exist.');
    }

    this._events = [
      ...this._events.slice(0, index),
      updatedEvent,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, updatedEvent);
  }

  addEvent(updateType, newEvent) {
    this._events = [newEvent, ...this._events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, eventInfo) {
    const index = this._events.findIndex((eventItem) => eventItem.id === eventInfo.id);

    if (index === -1) {
      throw new Error ('Can\'t delete the event which is not exist.');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(eventInfo) {
    const adaptedEvent = Object.assign(
      {},
      eventInfo,
      {
        basePrice: eventInfo.base_price,
        dateFrom: new Date(eventInfo.date_from),
        dateTo: new Date(eventInfo.date_to),
        isFavorite: eventInfo.is_favorite,
      },
    );
    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(eventInfo) {
    const adaptedEvent = Object.assign(
      {},
      eventInfo,
      {
        base_price: eventInfo.basePrice,
        date_from: eventInfo.dateFrom.toISOString(),
        date_to: eventInfo.dateTo.toISOString(),
        is_favorite: eventInfo.isFavorite,
      },
    );
    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
