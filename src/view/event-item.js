import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const createEventItemTemplate = (event) => {
  const { type, destination, startDate, endDate, cost, offers } = event;
  let timeRangeFormat, durationFormat, eventDuration;

  const renderOffers = () => {
    const renderedOffers = offers.map((offer) => {
      return `<li class="event__offer">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
    });
    return (renderedOffers.length > 0) ? renderedOffers.join('') : '';
  };

  const defineDurationAndFormats = () => {
    dayjs.extend(duration);
    const datesDifference = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

    switch (true) {
      case datesDifference.days() > 0:
        durationFormat = 'DD[D] HH[H] mm[M]';
        timeRangeFormat = 'DD/MM/YY HH:mm';
        break;
      case datesDifference.days() === 0 && datesDifference.hours() > 0:
        durationFormat = 'HH[H] mm[M]';
        timeRangeFormat = 'HH:mm';
        break;
      default:
        durationFormat = 'mm[M]';
        timeRangeFormat = 'HH:mm';
    }
    eventDuration = datesDifference.format(durationFormat);
  };

  defineDurationAndFormats();
  const day = dayjs(startDate).format('DD MMM');
  const startTime = dayjs(startDate).format(timeRangeFormat);
  const endTime = dayjs(endDate).format(timeRangeFormat);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${startDate}">${day}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${startDate}">${startTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${endDate}">${endTime}</time>
      </p>
      <p class="event__duration">${eventDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${cost}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${renderOffers()}`
};
