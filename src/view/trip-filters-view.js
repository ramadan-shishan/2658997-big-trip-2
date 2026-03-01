import AbstractView from '../framework/view/abstract-view';

function createFilterTemplate(filter, currentFilterType) {

  return `
     <div class="trip-filters__filter">
        <input id="filter-${filter}"
               class="trip-filters__filter-input  visually-hidden"
               type="radio"
               name="trip-filter"
               value="${filter}"
               ${filter === currentFilterType ? 'checked' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>
  `;
}

function createTripFilterTemplate(filters, currentFilterType) {
  const filterTemplate = filters
    .map((filterItem) => createFilterTemplate(filterItem, currentFilterType))
    .join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFilterView extends AbstractView {
  #filters = [];
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
