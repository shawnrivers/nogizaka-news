const Twit = require("twit");
const config = require("./config");

// Set an array to store gathered tweets.
let tweetsList = [];

const T = new Twit(config);

// Check whether the text includes "乃木坂".
function checkNogizaka(text) {
  if (text.includes("乃木坂")) {
    return true;
  } else {
    return false;
  }
}

function retweet(tweetID, createdDate) {
  T.post("statuses/retweet/:id", { id: tweetID }, (err, data, response) => {
    if (err) {
      console.log("Error code " + err.code + ": " + err.message + "\n");
    } else {
      console.log(
        "Retweeted @" +
          data.user.screen_name +
          " tweeted at: " +
          createdDate +
          "\n" +
          data.text +
          "\n----------\n"
      );
    }
  });
}

function getTimelinesAndRetweet() {
  Promise.all([
    T.get("statuses/user_timeline", {
      user_id: "142921471", // モデルプレス
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "24172196", // MANTANWEB
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "95207674", // ORICON NEWS
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "5649672", // 音楽ナタリー
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "1516060316", // LINE NEWS
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "46058599", // 日刊スポーツ
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "317684165", // 乃木坂46
      include_rts: false,
      count: 10
    }),
    T.get("statuses/user_timeline", {
      user_id: "929625878249684992", // 乃木坂工事中
      include_rts: false,
      count: 1
    }),
    T.get("statuses/user_timeline", {
      user_id: "1001065920234573824", // 乃木坂46新聞
      include_rts: false,
      count: 3
    })
  ])
    .then(response => {
      // Check whether the tweets are nogizaka-related.
      for (let i = 0; i < 6; i++) {
        const timeline = response[i].data;
        for (let j = 0; j < timeline.length; j++) {
          const tweetID = timeline[j].id_str;
          const text = timeline[j].text;
          const userName = timeline[j].user.screen_name;
          const createdDate = new Date(timeline[j].created_at);

          if (checkNogizaka(text)) {
            const tweetObj = {
              tweetID,
              createdDate,
              userName
            };
            tweetsList.push(tweetObj);
          }
        }
      }

      for (let i = 6; i < 9; i++) {
        const timeline = response[i].data;
        for (let j = 0; j < timeline.length; j++) {
          const tweetID = timeline[j].id_str;
          const text = timeline[j].text;
          const userName = timeline[j].user.screen_name;
          const createdDate = new Date(timeline[j].created_at);

          const tweetObj = {
            tweetID,
            createdDate,
            userName
          };
          tweetsList.push(tweetObj);
        }
      }

      // Sort tweets in time sequence.
      tweetsList.sort(
        (tweet1, tweet2) => (tweet1.createdDate > tweet2.createdDate ? 1 : -1)
      );

      // Retweet tweets.
      for (let i = 0; i < tweetsList.length; i++) {
        retweet(tweetsList[i].tweetID, tweetsList[i].createdDate);
      }
    })
    .catch(err => console.log(err));
}

getTimelinesAndRetweet();

// Get and retweet every 15 min.
setInterval(getTimelinesAndRetweet, 1000 * 60 * 15);
