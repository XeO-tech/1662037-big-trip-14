import AbstractView from './abstract.js';
import { calculateTripCost } from '../utils/events.js';

const createTripCostTemplate = (events) => {

  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTripCost(events)}</span>
</p>`;
};

export default class TripCost extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }
  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}

