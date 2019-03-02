import isString from 'lodash/isString';

export const padLeft = n => (n < 10 ? `0${n}` : n);

const getTime = (dateString) => {
  let date;
  if (typeof dateString !== 'undefined') {
    if (!isString(dateString)) {
      throw new Error('A string must be given.');
    }
    date = new Date(dateString);
    if (date === 'Invalid Date') {
      throw new Error('Not a valid date string.');
    }
  } else {
    date = new Date();
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
  };
};

export default getTime;
