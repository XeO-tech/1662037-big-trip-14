import AbstractView from './abstract.js';

const createTripCostTemplate = (events) => {
  const totalPrice = events.reduce((accumulator1, eventElement) => {
    const offersTotalCost = eventElement.offers.reduce((accumulator2, offerElement) => accumulator2 + offerElement.price, 0);
    return accumulator1 + eventElement.basePrice + offersTotalCost;
  }, 0);
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
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

