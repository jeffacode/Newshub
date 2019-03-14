// voteStrategies[previous voted, state] => [current voted, incremental votes]
const voteStrategies = {
  [-1]: {
    1: [1, 2],
    [-1]: [0, 1],
  },
  0: {
    1: [1, 1],
    [-1]: [-1, -1],
  },
  1: {
    1: [0, -1],
    [-1]: [-1, -2],
  },
};

export default voteStrategies;
