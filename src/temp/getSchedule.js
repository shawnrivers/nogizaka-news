const req = require('request-promise');

const url = `http://www.nogizaka46.com/schedule/`;

req(url)
  .then(html => console.log(html))
  .catch(err => console.log('Error:', err));
