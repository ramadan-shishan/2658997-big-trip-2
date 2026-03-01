import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const.js';

function createSortTemplate (sort, currentSortType) {
  const isDisabled = sort === SortType.EVENT || sort === SortType.OFFERS;

  return `
    <div class="trip-sort__item  trip-sort__item--${sort}">
      <input id="sort-${sort}"
             class="trip-sort__input  visually-hidden"
             type="radio"
             name="trip-sort"
             value="sort-${sort}"
             data-sort-type="${sort}"
             ${sort === currentSortType ? 'checked' : ''}
             ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
    </div>
  `;
}

function createTripSortTemplate(sorts, currentSortType) {
  const sortsTemplate = sorts
    .map((sortItem) => createSortTemplate(sortItem, currentSortType))
    .join('');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortsTemplate}
          </form>`;
}

export default class TripSortView extends AbstractView {
  #sorts = [];
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({sorts, currentSortType, onSortTypeChange}) {
    super();
    this.#sorts = sorts;
    this.#currentSortType = currentSortType;

    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return createTripSortTemplate(this.#sorts, this.#currentSortType);
  }
}
