export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, items),
      ),
    );
  }

  setEventItem(key, value) {
    const store = this.getItems();
    const events = this.getItems()['events'];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          'events': Object.assign({}, events, {[key]: value})
          }
        ),
      ),
    );
  }

  removeEventItem(key) {
    const store = this.getItems();

    delete store['events'][key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store,
      ),
    );
  }
}
