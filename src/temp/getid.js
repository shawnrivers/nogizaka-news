const Twit = require("twit");
const config = require("../config");

const T = new Twit(config);

const accountName = "nikkansports";

T.get(
  "statuses/user_timeline",
  {
    screen_name: accountName,
    count: 1
  },
  (err, data, response) => {
    console.log(
      data[0].user.name + "(@" + data[0].user.screen_name + "): " + data[0].user.id_str
    );
  }
);
