import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const padValue = (value) => String(value).padStart(2, '0');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

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

function sortPointPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {getRandomArrayElement, getRandomNumber, humanizeTripDueDate, getPointDuration, sortPointDay, sortPointPrice};
