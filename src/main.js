import {RenderPosition, render, replace, remove } from './framework/render.js';
import { UpdateType } from './const.js';

import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import TripInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic ramazan0112ts1993';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filtersModel = new FilterModel();
const sortsModel = new SortModel();

const handleNewPointFormClose = () => {
  newPointButtonElement.disabled = false;
};

const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  pointModel: pointsModel,
  sortModel: sortsModel,
  filterModel: filtersModel,
  onNewPointDestroy: handleNewPointFormClose
});

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint();
  newPointButtonElement.disabled = true;
};

newPointButtonElement.addEventListener('click', handleNewPointButtonClick);

const filterPresenter = new FilterPresenter({
  container: tripControlsElement,
  filterModel: filtersModel,
  pointModel: pointsModel
});

filterPresenter.init();
boardPresenter.init();

let tripInfoComponent = null;

const renderTripInfo = () => {
  if (pointsModel.destinations.length === 0) {
    if (tripInfoComponent) {
      remove(tripInfoComponent);
      tripInfoComponent = null;
    }
    return;
  }

  const prevInfoComponent = tripInfoComponent;

  tripInfoComponent = new TripInfoView({
    points: pointsModel.points,
    destinations: pointsModel.destinations,
    offers: pointsModel.offers
  });

  if (prevInfoComponent === null) {
    render(tripInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
    return;
  }

  replace(tripInfoComponent, prevInfoComponent);
  remove(prevInfoComponent);
};

pointsModel.addObserver((updateType) => {
  if (updateType !== UpdateType.PATCH) {
    renderTripInfo();
  }
});

pointsModel.init()
  .catch((err) => {
    throw err;
  })
  .finally(() => {
    renderTripInfo();
  });
