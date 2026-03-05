import AbstractView from '../framework/view/abstract-view.js';

function createFailedLoadDataTemplate() {
  return `
    <p class="trip-events__msg">Failed to load latest route information</p>
  `;
}

export default class FailedLoadData extends AbstractView {
  #isError = false;

  constructor({isError = false}) {
    super();
    this.#isError = isError;
  }

  get template() {
    return createFailedLoadDataTemplate();
  }
}
