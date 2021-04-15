import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import EventItemView from './view/event-item.js';
import AddAndEditFormView from './view/form-add-and-edit-event.js';
import SortingPanelView from './view/sorting-panel.js';
import EmptyListPlaceholderView  from './view/no-events.js';
import FiltersPanelView from './view/filters.js';
import SiteMenuView from './view/site-menu.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending } from './utils/events.js';
import { render, replace } from './utils/render.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);
const eventsSortedByDate = sortEventsByStartDateAscending(events);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

const renderEvent = (parentElement, eventItem) => {
  const eventComponent = new EventItemView(eventItem);
  const eventEditFormComponent = new AddAndEditFormView(eventItem);
  const eventElement = eventComponent.getElement();
  const eventEditFormElement = eventEditFormComponent.getElement();

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replace(eventElement, eventEditFormElement);
    }
  };

  eventComponent.setArrowClickHandler(() => {
    replace(eventEditFormElement, eventElement);
    document.addEventListener('keydown', onEscKeydown);
  });

  eventEditFormComponent.setArrowClickHandler(() => {
    replace(eventElement, eventEditFormElement);
    document.removeEventListener('keydown', onEscKeydown);
  });

  eventEditFormComponent.setSubmitHandler(() => {
    replace(eventElement, eventEditFormElement);
    document.removeEventListener('keydown', onEscKeydown);
  });

  render(parentElement, eventComponent, 'beforeend');
};

const renderAllEvents = (events) => {
  if (Object.keys(events).length === 0) {
    render(eventListElement, new EmptyListPlaceholderView(), 'beforebegin');
    return;
  }
  render(tripInfoElement, new TripInfoView(events), 'afterbegin');
  render(tripInfoElement, new TripCostView(events), 'beforeend');
  render(sortingElement, new SortingPanelView(), 'afterbegin');
  eventsSortedByDate.forEach((eventItem) => renderEvent(eventListElement,eventItem));
};

render(menuElement, new SiteMenuView(), 'beforeend');
render(filtersElement, new FiltersPanelView(), 'beforeend');
renderAllEvents(events);
