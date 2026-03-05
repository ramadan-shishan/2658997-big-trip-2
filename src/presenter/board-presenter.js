import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { sortPointDay, sortPointTime, sortPointPrice, filter } from '../utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import FailedLoadData from '../view/failed-load-data-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';


export default class BoardPresenter {

  #container = null;
  #pointsModel = null;
  #sortsModel = null;
  #filterModel = null;
  #eventsListComponent = new EventsListView();

  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #isLoading = true;
  #isError = false;

  constructor({container, pointModel, sortModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#pointsModel = pointModel;
    this.#sortsModel = sortModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#sortsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.activeFilter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    const activeSort = this.#sortsModel.activeSort;

    switch (activeSort) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
      case SortType.DAY:
        return filteredPoints.sort(sortPointDay);
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);

      default:
        return filteredPoints.sort(sortPointPrice);
    }
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#sortsModel.setSort(UpdateType.MAJOR, SortType.DAY);
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#pointsModel.destinations, this.#pointsModel.offers);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#sortsModel.activeSort === sortType) {
      return;
    }

    this.#sortsModel.setSort(UpdateType.MINOR, sortType);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        const presenter = this.#pointPresenters.get(data?.id);
        if (presenter) {
          presenter.init(
            data,
            this.#pointsModel.destinations,
            this.#pointsModel.offers
          );
        }
        break;
      }
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        if (this.#pointsModel.destinations.length === 0 || this.#pointsModel.offers.length === 0) {
          this.#isError = true;
        }

        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    const presenter = this.#pointPresenters.get(update.id) || this.#newPointPresenter;

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        presenter.setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          presenter.setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        presenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          presenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        presenter.setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          presenter.setAborting();
        }
        break;
    }
  };

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, destinations, offers);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#sortsModel.setSort(UpdateType.PATCH, SortType.PRICE);
    }
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      sorts: this.#sortsModel.sorts,
      currentSortType: this.#sortsModel.activeSort,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    if (this.#isError) {
      this.#clearBoard();
      remove(this.#loadingComponent);
      render(new FailedLoadData(this.#isError), this.#container);
      return;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#eventsListComponent, this.#container);

    points.forEach((point) => {
      this.#renderPoint(point, this.#pointsModel.destinations, this.#pointsModel.offers);
    });
  }

  #renderLoading() {
    render(
      this.#loadingComponent,
      this.#container,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterModel.activeFilter
    });

    render(this.#noPointsComponent, this.#container);
  }
}
