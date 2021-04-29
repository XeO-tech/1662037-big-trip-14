export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(callback) {
    this._observers.splice(this._observers.indexOf(callback), 1);
    //this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(event, payload) {
    this._observers.forEach((callback) => callback(event, payload));
  }
}
