import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import EventItemView from '../view/event-item.js';
import AddAndEditFormView from '../view/form-add-and-edit-event.js';
import SortingPanelView from '../view/sorting-panel.js';
import EmptyListPlaceholderView  from '../view/no-events.js';
import { render, replace } from '../utils/render.js';

const tripInfoElement = document.querySelector('.trip-main__trip-info');
const sortingElement = document.querySelector('.trip-events');
const eventListElement = document.querySelector('.trip-events__list');

export default class Trip {
  constructor() {
    this._sortingPanelComponent = new SortingPanelView();
    this._EmptyListPlaceholderComponent = new EmptyListPlaceholderView();
  }

  init(events) {
    this._events = [...events];
    this._tripInfoComponent = new TripInfoView(events);
    this._tripCostComponent = new TripCostView(events);

    this._renderSort();
    this._renderTripInfo();
    this._renderTripCost();

    (Object.keys(this._events).length === 0) ? this._renderEmptyList() : this._renderEvents();
  }

  _renderEvent(eventItem) {
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

    render(eventListElement, eventComponent, 'beforeend');
  }

  _renderEvents() {
    this._events.forEach((eventItem) => this._renderEvent(eventItem));
  }

  _renderEmptyList() {
    render(eventListElement, this._EmptyListPlaceholderComponent, 'beforebegin');
  }

  _renderSort() {
    render(sortingElement, this._sortingPanelComponent, 'afterbegin');
  }

  _renderTripInfo() {
    render(tripInfoElement, this._tripInfoComponent, 'afterbegin');
  }

  _renderTripCost() {
    render(tripInfoElement, this._tripCostComponent, 'beforeend');
  }
}
