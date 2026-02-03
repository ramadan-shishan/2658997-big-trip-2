import { mockPoints } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

export default class PointsModel {

  pointsData = mockPoints;
  destinationsData = mockDestinations;
  offersData = mockOffers;

  get points() {
    return this.pointsData;
  }

  get destinations() {
    return this.destinationsData;
  }

  get offers() {
    return this.offersData;
  }
}
