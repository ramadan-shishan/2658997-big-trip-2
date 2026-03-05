import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TRIP_TYPES } from '../const.js';
import { humanizeTripDueDate } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createTypeItemTemplate (type, currentType, isDisabled) {
  return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
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

function createOfferTemplate (offer, selectedOffers, isDisabled) {

  const {id, title, price} = offer;
  const isChecked = selectedOffers.includes(id) ? 'checked' : '';

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${id}"
             type="checkbox"
             name="event-offer-${id}"
             ${isChecked}
             ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
}

function createEditPointTemplate(point, destinations, offers) {

  const {
    type,
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers: selectedOffers,
    isDisabled,
    isSaving,
    isDeleting
  } = point;

  const startDate = humanizeTripDueDate(dateFrom, 'MMMM DD');
  const endDate = humanizeTripDueDate(dateTo, 'MMMM DD');
  const startTime = humanizeTripDueDate(dateFrom, 'HH:mm');
  const endTime = humanizeTripDueDate(dateTo, 'HH:mm');

  const pointDestination = destinations.find((item) => item.id === destination) || {};
  const offersByType = offers.find((offerItem) => offerItem.type === type)?.offers || [];

  const typeItemsTemplate = TRIP_TYPES
    .map((typeItem) => createTypeItemTemplate(typeItem, type, isDisabled))
    .join('');

  const destinationOptionsTemplate = destinations
    .map((destinationItem) => createDestinationOptionTemplate(destinationItem))
    .join('');

  const picturesTemplate = (pointDestination.pictures || [])
    .map((picture) => createPictureTemplate(picture))
    .join('');

  const offersTemplate = offersByType
    .map((offerItem) => createOfferTemplate(offerItem, selectedOffers, isDisabled))
    .join('');

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
                           value="${pointDestination.name || ''}"
                           list="destination-list-1"
                           ${isDisabled ? 'disabled' : ''}
                    >
                    <datalist id="destination-list-1">
                      ${destinationOptionsTemplate}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}" ${isDisabled ? 'disabled' : ''}>
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
                           ${isDisabled ? 'disabled' : ''}
                    >
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
                    ${isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
                    ${isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${offersByType.length > 0 ? `
                    <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offersTemplate}
                    </div>
                  </section>
                  ` : ''}

                  <section class="event__section  event__section--destination">
                    ${pointDestination.description ? `
                      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                      <p class="event__destination-description">${pointDestination.description}</p>
                    ` : ''}

                    <div class="event__photos-container">
                      ${picturesTemplate ? `
                        <div class="event__photos-tape">
                          ${picturesTemplate}
                        </div>
                      ` : ''}
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EditPointView extends AbstractStatefulView {

  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, destinations, offers, onFormSubmit, onRollupClick, onDeleteClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));

    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    const priceInputElement = this.element.querySelector('.event__input--price');

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    priceInputElement
      .addEventListener('input', this.#priceInputChangeHandler);
    priceInputElement
      .addEventListener('focus', this.#priceFocusHandler);
    priceInputElement
      .addEventListener('blur', this.#priceBlurHandler);

    this.#setDatepicker();
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
      },
    );
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offers);
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    const updatedOffers = checkedOffers.map((offer) => offer.id.replace('event-offer-', ''));

    this.#handleFormSubmit(
      EditPointView.parseStateToPoint({
        ...this._state,
        offers: updatedOffers
      })
    );
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();

    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    const updatedOffers = checkedOffers.map((offer) => offer.id.replace('event-offer-', ''));

    this.updateElement({
      offers: updatedOffers,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const name = evt.target.value;
    const newDestination = this.#destinations.find((item) => item.name === name);

    if (!newDestination) {
      this.element.querySelector('.event__save-btn').disabled = true;
      return;
    }

    this.element.querySelector('.event__save-btn').disabled = false;

    this.updateElement({
      destination: newDestination.id,
    });
  };

  #priceInputChangeHandler = (evt) => {
    evt.preventDefault();
    const value = evt.target.value.replace(/\D/g, '');

    evt.target.value = value;

    this._setState({
      basePrice: Number(value),
    });
  };

  #priceFocusHandler = (evt) => {
    if (Number(evt.target.value) === 0) {
      evt.target.value = '';
    }
  };

  #priceBlurHandler = (evt) => {
    if (evt.target.value.trim() === '') {
      evt.target.value = '0';
      this._setState({
        basePrice: 0,
      });
    }
  };
}
