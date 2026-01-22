import TripInfoView from './view/trip-info-view';
import TripFilterView from './view/trip-filter-view.js';
import {RenderPosition, render } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';


const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({container: tripEventsElement});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new TripFilterView(), tripControlsElement);

boardPresenter.init();
