var moment = require('moment');

function getTimeStrategy(time) {
  var currentMoment = moment(); // 避免出现单例
  switch (time) {
    case 'hour':
      return {
        $gt: currentMoment.subtract(1, 'hours').toDate(),
      };
    case 'day':
      return {
        $gt: currentMoment.subtract(1, 'days').toDate(),
      };
    case 'week':
      return {
        $gt: currentMoment.subtract(1, 'weeks').toDate(),
      };
    case 'month':
      return {
        $gt: currentMoment.subtract(1, 'months').toDate(),
      };
    case 'year':
      return {
        $gt: currentMoment.subtract(1, 'years').toDate(),
      };
    case 'all':
      return {
        $gt: moment('1991-12-23').toDate(),
      };
  };
};

function getPopularityStrategy(p) {
  switch(p) {
    case 'new': // 新创建的
      return '$publishedAt'; 
    case 'best': // upvotes数最高的
      return '$upvotes';
    case 'hot': // upvotes数或downvotes数最高的
      return {
        $cond: {
          if: {
            $gt: ["$upvotes", "$downvotes"],
          },
          then: '$upvotes',
          else: '$downvotes',
        },
      };
    case 'rising': // votes数最高的
      return '$votes';
  }
};

function getSortStrategy(p) {
  switch(p) {
    case 'new': // 新创建的
      return {
        popularity: -1,
      };
    case 'best': // upvotes数最高的
      return {
        popularity: -1,
        publishedAt: -1,
      };
    case 'hot': // upvotes数或downvotes数最高的
      return {
        popularity: -1,
        publishedAt: -1,
      };
    case 'rising': // votes数最高的
      return {
        popularity: -1,
        publishedAt: -1,
      };
  }
};

/**
 * voteStrategies[previous voted, state] => [
    current voted,
    incremental votes,
    incremental downvotes,
    incremental upvotes,
  ]
 */
var voteStrategies = {
  [-1]: {
    1: [1, 2, -1, 1],
    [-1]: [0, 1, -1, 0],
  },
  0: {
    1: [1, 1, 0, 1],
    [-1]: [-1, -1, 1, 0],
  },
  1: {
    1: [0, -1, 0, -1],
    [-1]: [-1, -2, 1, -1],
  },
};

module.exports = {
  getTimeStrategy,
  getPopularityStrategy,
  getSortStrategy,
  voteStrategies,
};
