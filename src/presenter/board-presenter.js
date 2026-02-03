import EventsListView from '../view/events-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointView from '../view/trip-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render } from '../render.js';


export default class BoardPresenter {

  eventsListViewComponent = new EventsListView();

  constructor({container, pointsModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {

    this.boardPoints = [...this.pointsModel.points];
    const destinations = this.pointsModel.destinations;
    const offers = this.pointsModel.offers;

    render(new TripSortView(), this.container);
    render(this.eventsListViewComponent, this.container);

    render(new EditPointView({
      point: this.boardPoints[0],
      destinations: destinations,
      offers: offers
    }), this.eventsListViewComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      const point = this.boardPoints[i];

      const destination = this.pointsModel.destinations.find((destinationItem) => destinationItem.id === point.destination);
      const offersForType = this.pointsModel.offers.find((offerItem) => offerItem.type === point.type).offers;
      const selectedOffers = offersForType.filter((offerItem) => point.offers.includes(offerItem.id));

      render(new TripPointView({
        point,
        destination,
        offers: selectedOffers
      }), this.eventsListViewComponent.getElement());
    }
  }
}
