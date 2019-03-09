import { T } from '../utils/twit';
import { newsMediaAccounts, nogizakaRelatedAccounts } from '../utils/constants';
import { relatesToNogizaka } from './nogizaka';
import { IWatchedAccount, ITweet } from '../utils/types';

const getTimeline = async (account: IWatchedAccount): Promise<ITweet[]> => {
  let timeline: ITweet[] = [];
  const params = {
    user_id: account.id,
    include_rts: false,
    count: account.count,
  };
  await T.get('statuses/user_timeline', params)
    .then((res: any) => {
      for (const data of res.data) {
        const tweet: ITweet = {
          id: data.id_str,
          createdDate: new Date(data.created_at),
          userName: data.user.screen_name,
          text: data.text,
        };
        timeline.push(tweet);
      }
    })
    .catch(err => {
      console.log('Error:', err);
    });

  return timeline;
};

const getTweets = async (accounts: IWatchedAccount[]): Promise<ITweet[]> => {
  let tweets: ITweet[] = [];
  for (const account of accounts) {
    const timeline = await getTimeline(account);
    tweets.push(...timeline);
  }

  return tweets;
};

const getTweetsFromNogizaka = async (accounts: IWatchedAccount[]): Promise<ITweet[]> => {
  const tweets = await getTweets(accounts);

  return tweets;
};

const getNogizakaTweetsFromMedia = async (accounts: IWatchedAccount[]): Promise<ITweet[]> => {
  const tweets = await getTweets(accounts);
  const nogizakaRelatedTweets = tweets.filter(tweet => relatesToNogizaka(tweet.text));

  return nogizakaRelatedTweets;
};

const retweetNogizakaRelated = async (nogizakaAccounts: IWatchedAccount[], mediaAccounts: IWatchedAccount[]) => {
  console.log('[News] Retweet cycle starts.');

  const tweetsFromNogizaka = await getTweetsFromNogizaka(nogizakaAccounts);
  const nogizakaTweetsFromMedia = await getNogizakaTweetsFromMedia(mediaAccounts);
  const nogizakaRelatedTweets = [...tweetsFromNogizaka, ...nogizakaTweetsFromMedia];

  nogizakaRelatedTweets.sort((tweetA, tweetB) => (tweetA.createdDate > tweetB.createdDate ? 1 : -1));

  for (const tweet of nogizakaRelatedTweets) {
    await T.post('statuses/retweet/:id', {
      id: tweet.id,
    })
      .then(() => console.log(`[News] Retweet succeeded: ${tweet.id} from ${tweet.userName}`))
      .catch(err => {
        console.log('[News] Retweet failed:', err.message);
      });
  }

  console.log('[News] Retweet cycle finished.\n');
};

export const watchAndRetweet = (interval: number) => {
  retweetNogizakaRelated(nogizakaRelatedAccounts, newsMediaAccounts);
  setInterval(() => retweetNogizakaRelated(nogizakaRelatedAccounts, newsMediaAccounts), interval);
};
