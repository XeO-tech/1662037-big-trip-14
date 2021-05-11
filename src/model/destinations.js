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

  updateDestination(newDestination) {
    const index = this._destinations.findIndex((destination) => destination.name === newDestination.name);

    this._destinations = [
      ...this._destinations.slice(0, index),
      newDestination,
      ...this._destinations.slice(index + 1),
    ];
  }
}
