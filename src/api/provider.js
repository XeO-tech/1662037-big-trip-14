import EventsModel from '../model/events.js';
import { isOnline } from '../utils/common.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  const events = items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
  return {'events': events}
};

const createDestinationsStructure = (items) => {
  const destinations = items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.name]: current,
    });
  }, {});
  return {'destinations': destinations}
};

const createOffersStructure = (items) => {
  const offers = items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.type]: current,
    });
  }, {});
  return {'offers': offers}
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
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._store.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems()['events']);

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createDestinationsStructure(destinations);
          this._store.setItems(items);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems()['destinations']);

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createOffersStructure(offers);
          this._store.setItems(items);

          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getItems()['offers']);

    return Promise.resolve(storeOffers);
  }

  updateEvent(eventItem) {
    if (isOnline()) {
      return this._api.updateTask(eventItem)
        .then((updatedEvent) => {
          this._store.setEventItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setEventItem(eventItem.id, EventsModel.adaptToServer(Object.assign({}, eventItem)));

    return Promise.resolve(eventItem);
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

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

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
