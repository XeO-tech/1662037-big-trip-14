import EventsModel from '../model/events.js';
import { isOnline } from '../utils/common.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
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

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  // getDestinations() {
  //   if (isOnline()) {
  //     return this._api.getDestinations()
  //       .then((destinations) => {
  //         const items = createStoreStructure(destinations);
  //         this._store.setItems(items);
  //         return destinations;
  //       });
  //   }

  //   const storeDestinations = Object.values(this._store.getItems());

  //   return Promise.resolve(storeDestinations);
  // }

  // getOffers() {
  //   if (isOnline()) {
  //     return this._api.getOffers()
  //       .then((offers) => {
  //         const items = createStoreStructure(offers);
  //         this._store.setItems(items);
  //         return offers;
  //       });
  //   }

  //   const storeOffers = Object.values(this._store.getItems());

  //   return Promise.resolve(storeOffers);
  // }

  updateEvent(eventItem) {
    if (isOnline()) {
      return this._api.updateTask(eventItem)
        .then((updatedEvent) => {
          this._store.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setItem(eventItem.id, EventsModel.adaptToServer(Object.assign({}, eventItem)));

    return Promise.resolve(eventItem);
  }

  addEvent(eventItem) {
    if (isOnline()) {
      return this._api.addTask(eventItem)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error('Add event failed'));
  }

  deleteTask(eventItem) {
    if (isOnline()) {
      return this._api.deleteTask(eventItem)
        .then(() => this._store.removeItem(eventItem.id));
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
