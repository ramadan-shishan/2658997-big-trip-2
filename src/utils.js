import { FilterType } from './const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const padValue = (value) => String(value).padStart(2, '0');

function humanizeTripDueDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getPointDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const dur = dayjs.duration(diff);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();

  if (days > 0) {
    return `${padValue(days)}D ${padValue(hours)}H ${padValue(minutes)}M`;
  }

  if (hours > 0) {
    return `${padValue(hours)}H ${padValue(minutes)}M`;
  }

  return `${padValue(minutes)}M`;
}

function sortPointDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPointTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
}

function sortPointPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function isPointFuture(dateFrom) {
  return dayjs().isBefore(dayjs(dateFrom), 'minute');
}

function isPointPresent(dateFrom, dateTo) {
  return dayjs().isSame(dateFrom, 'day') || (dayjs().isAfter(dateFrom, 'day') && dayjs().isBefore(dateTo, 'day'));
}

function isPointPast(dateTo) {
  return dayjs().isAfter(dayjs(dateTo), 'minute');
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo)),
};

export {
  humanizeTripDueDate,
  getPointDuration,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
  filter
};
