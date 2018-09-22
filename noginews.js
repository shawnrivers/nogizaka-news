const Twit = require("twit");
const config = require("./config");

const newsMedia = [
  { id: "142921471", count: 30 }, // モデルプレス
  { id: "24172196", count: 30 }, // MANTANWEB
  { id: "95207674", count: 30 }, // ORICON NEWS
  { id: "5649672", count: 30 }, // 音楽ナタリー
  { id: "1516060316", count: 30 }, // LINE NEWS
  { id: "46058599", count: 30 } // 日刊スポーツ
];

const nogizakaRelated = [
  { id: "317684165", count: 10 }, // 乃木坂46
  { id: "929625878249684992", count: 1 }, // 乃木坂工事中
  { id: "1001065920234573824", count: 1 } // 乃木坂46新聞
];

const T = new Twit(config);

// Check whether the text includes "乃木坂".
function checkNogizaka(text) {
  if (
    text.includes("乃木坂") ||
    text.includes("西野七瀬") ||
    text.includes("生駒里奈") ||
    text.includes("川村真洋") ||
    text.includes("斎藤ちはる") ||
    text.includes("相楽伊織") ||
    text.includes("伊藤万理華") ||
    text.includes("中元日芽香") ||
    text.includes("橋本奈々未") ||
    text.includes("深川麻衣") ||
    text.includes("永島聖羅") ||
    text.includes("松井玲奈") ||
    text.includes("畠中清羅") ||
    text.includes("大和里菜") ||
    text.includes("伊藤寧々") ||
    text.includes("市來玲奈") ||
    text.includes("宮沢セイラ") ||
    text.includes("宮澤成良") ||
    text.includes("柏幸奈") ||
    text.includes("安藤美雲") ||
    text.includes("岩瀬佑美子")
  ) {
    return true;
  } else {
    return false;
  }
}

function getTimelinesAndRetweet() {
  let getPromises = [];

  for (let i = 0; i < newsMedia.length; i++) {
    getPromises.push(
      T.get("statuses/user_timeline", {
        user_id: newsMedia[i].id,
        include_rts: false,
        count: newsMedia[i].count
      })
    );
  }

  for (let i = 0; i < nogizakaRelated.length; i++) {
    getPromises.push(
      T.get("statuses/user_timeline", {
        user_id: nogizakaRelated[i].id,
        include_rts: false,
        count: nogizakaRelated[i].count
      })
    );
  }

  Promise.all(getPromises)
    .then(response => {
      // Clear tweetsList.
      let tweetsList = [];

      // News media
      for (let i = 0; i < newsMedia.length; i++) {
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

      // Nogizaka-related
      for (
        let i = newsMedia.length;
        i < newsMedia.length + nogizakaRelated.length;
        i++
      ) {
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
      retweetAll(tweetsList);
    })
    .catch(err => console.log(err));
}

async function retweet(tweet) {
  const retweetResponse = await T.post("statuses/retweet/:id", {
    id: tweet.tweetID
  })
    .then(() => console.log("Succeeded: Retweeted!"))
    .catch(err => {
      console.log("Error:", err.message);
    });
}

async function retweetAll(tweetsList) {
  for (const tweet of tweetsList) {
    await retweet(tweet);
  }
  console.log("Done!\n");
}

// Get and retweet when the app runs.
getTimelinesAndRetweet();

// Get and retweet every 15 min.
setInterval(getTimelinesAndRetweet, 1000 * 60 * 30);
