export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = [...destinations];
  }

  getDestinations() {
    return this._destinations;
  }

  getCitiesNames() {
    return this._destinations.map((destination) => destination.name);
  }
}
