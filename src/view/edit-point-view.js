import AbstractView from '../framework/view/abstract-view';
import { TRIP_TYPES } from '../const.js';
import { humanizeTripDueDate } from '../utils.js';

function createTypeItemTemplate (type, currentType) {
  return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>
  `;
}

function createDestinationOptionTemplate (destination) {
  return `<option value="${destination.name}"></option>`;
}

function createPictureTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

function createOfferTemplate (offer, selectedOffers) {

  const {id, title, price} = offer;
  const isChecked = selectedOffers.includes(id) ? 'checked' : '';

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${id}-1"
             type="checkbox"
             name="event-offer-${id}"
             ${isChecked}>
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
}

function createEditPointTemplate(point, destinations, offers) {

  const { type, basePrice, dateFrom, dateTo, destination, offers: selectedOffers } = point;

  const startDate = humanizeTripDueDate(dateFrom, 'MMMM DD');
  const endDate = humanizeTripDueDate(dateTo, 'MMMM DD');
  const startTime = humanizeTripDueDate(dateFrom, 'HH:mm');
  const endTime = humanizeTripDueDate(dateTo, 'HH:mm');

  const pointDestination = destinations.find((item) => item.id === destination);
  const offersByType = offers.find((offerItem) => offerItem.type === type).offers;

  const typeItemsTemplate = TRIP_TYPES
    .map((typeItem) => createTypeItemTemplate(typeItem, point.type))
    .join('');

  const destinationOptionsTemplate = destinations
    .map((destinationItem) => createDestinationOptionTemplate(destinationItem))
    .join('');

  const picturesTemplate = pointDestination.pictures
    .map((picture) => createPictureTemplate(picture))
    .join('');

  const offersTemplate = offersByType
    .map((offerItem) => createOfferTemplate(offerItem, selectedOffers))
    .join('');

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeItemsTemplate}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                    <input class="event__input  event__input--destination"
                           id="event-destination-1" type="text"
                           name="event-destination"
                           value="${pointDestination.name}"
                           list="destination-list-1"
                    >
                    <datalist id="destination-list-1">
                      ${destinationOptionsTemplate}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price"
                           id="event-price-1"
                           type="text" name="event-price"
                           value="${basePrice}"
                    >
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offersTemplate}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${pointDestination.description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${picturesTemplate}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EditPointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;

  constructor({point, destinations, offers}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#destinations, this.#offers);
  }
}
