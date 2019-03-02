import round from 'lodash/round';

const formatNumber = (number) => {
  if (Math.abs(number / 100000000) > 1) {
    return `${round(number / 100000000, 1)}b`;
  }
  if (Math.abs(number / 1000000) > 1) {
    return `${round(number / 1000000, 1)}m`;
  }
  if (Math.abs(number / 1000) > 1) {
    return `${round(number / 1000, 1)}k`;
  }
  return `${number}`;
};

export default formatNumber;
