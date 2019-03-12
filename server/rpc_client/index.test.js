var client = require('./index');

client.add(1, 2, function(response) {
  console.assert(response.result === 3);
});