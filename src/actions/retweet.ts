import { T } from '../utils/twit';
import { newsMediaAccounts, nogizakaRelatedAccounts } from'../utils/constants';
import { relatesToNogizaka } from'./nogizaka';

const getTimeline = async (account: any) => {
  let timeline: any[] = [];
  const getParams = {
    user_id: account.id,
    include_rts: false,
    count: account.count,
  };
  await T.get('statuses/user_timeline', getParams)
    .then((res: any) => {
      for (const data of res.data) {
        const tweet = {
          id: data.id_str,
          createdDate: new Date(data.created_at),
          userName: data.user.screen_name,
        };
        timeline.push(tweet);
      }
    })
    .catch((err: any) => {
      console.log('Error:', err);
    });

  return timeline;
};

const getTweets = async (accounts: any) => {
  let tweets = [];
  for (const account of accounts) {
    const timeline = await getTimeline(account);
    tweets.push(...timeline);
  }

  return tweets;
};

const getTweetsFromNogizaka = async (accounts: any) => {
  const tweets = await getTweets(accounts);

  return tweets;
};

const getNogizakaTweetsFromMedia = async (accounts: any) => {
  const tweets = await getTweets(accounts);
  const nogizakaRelatedTweets = tweets.filter(tweet => relatesToNogizaka(tweet.text));

  return nogizakaRelatedTweets;
};

const retweetNogizakaRelated = async (nogizakaAccounts: any, mediaAccounts: any) => {
  console.log('Retweet cycle starts.');

  const tweetsFromNogizaka = await getTweetsFromNogizaka(nogizakaAccounts);
  const nogizakaTweetsFromMedia = await getNogizakaTweetsFromMedia(mediaAccounts);
  const nogizakaRelatedTweets = [...tweetsFromNogizaka, ...nogizakaTweetsFromMedia];

  nogizakaRelatedTweets.sort((tweetA, tweetB) => (tweetA.createdDate > tweetB.createdDate ? 1 : -1));

  for (const tweet of nogizakaRelatedTweets) {
    await T.post('statuses/retweet/:id', {
      id: tweet.id,
    })
      .then(() => console.log(`Retweet succeeded: ${tweet.id} from ${tweet.userName}`))
      .catch((err: any) => {
        console.log('Retweet failed:', err.message);
      });
  }

  console.log('Retweet cycle is done.\n');
};

export const watchAndRetweet = (interval: number) => {
  retweetNogizakaRelated(nogizakaRelatedAccounts, newsMediaAccounts);
  setInterval(() => retweetNogizakaRelated(nogizakaRelatedAccounts, newsMediaAccounts), interval);
};

