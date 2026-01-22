import EventsListView from '../view/events-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointView from '../view/trip-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render } from '../render.js';


export default class BoardPresenter {
  EventsListViewComponent = new EventsListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new TripSortView(), this.container);
    render(this.EventsListViewComponent, this.container);
    render(new EditPointView, this.EventsListViewComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new TripPointView(), this.EventsListViewComponent.getElement());
    }
  }
}
