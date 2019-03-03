const { T } = require('../utils/twit');

const accountName = 'nikkansports';

T.get(
  'statuses/user_timeline',
  {
    screen_name: accountName,
    count: 1,
  },
  (err, data, response) => {
    if (!err) {
      console.log(data[0].user.name + '(@' + data[0].user.screen_name + '): ' + data[0].user.id_str);
    } else {
      console.log('Error:', err);
    }
  },
);
