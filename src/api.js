import EventsModel from './model/events.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
  }

  updateEvent(eventInfo) {
    return this._load({
      url: `points/${eventInfo.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(eventInfo)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  addEvent(eventInfo) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(eventInfo)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(eventInfo) {
    return this._load({
      url: `points/${eventInfo.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(() => {
        throw url;
      });
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw response.url.slice(response.url.lastIndexOf('/') + 1);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}
