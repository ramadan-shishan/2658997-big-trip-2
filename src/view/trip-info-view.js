import AbstractView from '../framework/view/abstract-view';
import { humanizeTripDueDate, sortPointDay } from '../utils.js';
import { DESTINATION_COUNT_MAX_VISIBLE } from '../const.js';

function createTripInfoTemplate(points, destinations, offers) {
  const totalCost = points.reduce((total, point) => {
    const pointOffers = offers.find((offerItem) => offerItem.type === point.type)?.offers || [];
    const selectedOffersCost = point.offers.reduce((sum, id) => {
      const offer = pointOffers.find((offerItem) => offerItem.id === id);
      return sum + (offer ? offer.price : 0);
    }, 0);
    return total + point.basePrice + selectedOffersCost;
  }, 0);

  if (points.length === 0) {
    return '<div></div>';
  }

  const sortedPoints = [...points].sort(sortPointDay);
  const routeCities = sortedPoints.map((point) =>
    destinations.find((d) => d.id === point.destination)?.name || ''
  );

  const title = routeCities.length > DESTINATION_COUNT_MAX_VISIBLE
    ? `${routeCities[0]} &mdash; ... &mdash; ${routeCities[routeCities.length - 1]}`
    : routeCities.join(' &mdash; ');

  const dateFrom = humanizeTripDueDate(sortedPoints[0].dateFrom, 'DD MMM');
  const dateTo = humanizeTripDueDate(sortedPoints[sortedPoints.length - 1].dateTo, 'DD MMM');

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">${dateFrom}&nbsp;&mdash;&nbsp;${dateTo} Mar</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
            </p>
          </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
