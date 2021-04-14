import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import EventItemView from './view/event-item.js';
import AddAndEditFormView from './view/form-add-and-edit-event.js';
import SortingPanelView from './view/sorting-panel.js';
import EmptyListPlaceholderView  from './view/no-events.js';
import FiltersPanelView from './view/filters.js';
import SiteMenuView from './view/site-menu.js';
import { generateEvents } from './mocks/events.js';
import { sortEventsByStartDateAscending, render } from './utils.js';

const EVENT_NUMBERS = 20;

const events = generateEvents(EVENT_NUMBERS);
const eventsSortedByStartDate = sortEventsByStartDateAscending(events);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main__trip-info');
const menuElement = document.querySelector('.trip-main__trip-controls');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

const renderEvent = (parentElement, eventItem) => {
  const eventComponent = new EventItemView(eventItem);
  const eventEditFormComponent = new AddAndEditFormView(eventItem);

  const replaceEventWithEditForm = () => {
    parentElement.replaceChild(eventEditFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditFormWithEvent = () => {
    parentElement.replaceChild(eventComponent.getElement(), eventEditFormComponent.getElement());
  };

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditFormWithEvent();
    }
  };

  eventComponent.setArrowClickHandler(() => {
    replaceEventWithEditForm();
    document.addEventListener('keydown', onEscKeydown);
  });

  eventEditFormComponent.setArrowClickHandler(() => {
    replaceEditFormWithEvent();
    document.removeEventListener('keydown', onEscKeydown);
  });

  eventEditFormComponent.setSubmitHandler(() => {
    replaceEditFormWithEvent();
    document.removeEventListener('keydown', onEscKeydown);
  });

  render(parentElement, eventComponent.getElement(), 'beforeend');
};

const renderAllEvents = (events) => {
  if (Object.keys(events).length === 0) {
    render(eventListElement, new EmptyListPlaceholderView().getElement(), 'beforebegin');
    return;
  }
  render(tripInfoElement, new TripInfoView(events).getElement(), 'afterbegin');
  render(tripInfoElement, new TripCostView(events).getElement(), 'beforeend');
  render(sortingElement, new SortingPanelView().getElement(), 'afterbegin');
  eventsSortedByStartDate.forEach((eventItem) => renderEvent(eventListElement,eventItem));
};

render(menuElement, new SiteMenuView().getElement(), 'beforeend');
render(filtersElement, new FiltersPanelView().getElement(), 'beforeend');
renderAllEvents(events);
