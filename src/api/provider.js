import EventsModel from '../model/events.js';
import { isOnline } from '../utils/common.js';
import { DataType } from '../consts.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items, dataType) => {
  const reducedEvents = items.reduce((acc, current) => {

    return Object.assign({}, acc, {
      [current[dataType.ID_KEY]]: current,
    });
  }, {});
  return {[dataType.NAME]: reducedEvents};
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer), DataType.EVENTS);
          this._store.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems()[DataType.EVENTS.NAME]);

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations, DataType.DESTINATIONS);
          this._store.setItems(items);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems()[DataType.DESTINATIONS.NAME]);

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers, DataType.OFFERS);
          this._store.setItems(items);

          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getItems()[DataType.OFFERS.NAME]);

    return Promise.resolve(storeOffers);
  }

  addEvent(eventItem) {
    if (isOnline()) {
      return this._api.addEvent(eventItem)
        .then((newEvent) => {
          this._store.setEventItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error('Add event failed'));
  }

  deleteEvent(eventItem) {
    if (isOnline()) {
      return this._api.deleteEvent(eventItem)
        .then(() => this._store.removeEventItem(eventItem.id));
    }

    return Promise.reject(new Error('Delete task failed'));
  }

  updateEvent(eventItem) {
    if (isOnline()) {
      return this._api.updateEvent(eventItem)
        .then((updatedEvent) => {
          this._store.setEventItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setEventItem(eventItem.id, EventsModel.adaptToServer(Object.assign({}, eventItem)));

    return Promise.resolve(eventItem);
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems()[DataType.EVENTS.NAME]);

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
