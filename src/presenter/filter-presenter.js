import { render, replace, remove } from '../framework/render.js';
import TripFilterView from '../view/trip-filters-view.js';
import { UpdateType } from '../const.js';
import { filter } from '../utils.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointModel = null;

  #filterComponent = null;

  constructor({container, filterModel, pointModel}) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointModel.points;
    const filters = this.#filterModel.filters
      .map((type) => ({
        type,
        count: filter[type] (points).length,
      }));
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFilterView({
      filters,
      currentFilterType: this.#filterModel.activeFilter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.activeFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
