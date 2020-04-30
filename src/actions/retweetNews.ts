import { getMillisecondsTilNextTime } from '../utils/date';
import { T } from '../utils/twit';
import { ITweet, IWatchedAccount } from '../utils/types';
import { containsShowroomSchedule, relatesToNogizaka } from './nogizaka';

export const getTimeline = async (account: IWatchedAccount, lastTweets: any): Promise<ITweet[]> => {
  const timeline: ITweet[] = [];
  const lastTweetId = lastTweets[account.id];

  const params =
    lastTweetId !== ''
      ? {
          user_id: account.id,
          include_rts: false,
          count: account.count,
          since_id: lastTweetId,
        }
      : {
          user_id: account.id,
          include_rts: false,
          count: account.count,
        };

  try {
    const response: any = await T.get('statuses/user_timeline', params);

    for (const data of response.data) {
      const tweet: ITweet = {
        id: data.id_str,
        createdDate: new Date(data.created_at),
        userId: data.user.id_str,
        userName: data.user.screen_name,
        text: data.text,
      };

      timeline.push(tweet);
    }

    timeline.sort((tweetA, tweetB) => (tweetA.createdDate > tweetB.createdDate ? 1 : -1));

    if (timeline.length > 0) {
      lastTweets[account.id] = timeline.slice(-1)[0].id;
    }
  } catch (err) {
    console.log('Error:', err);
  }

  return timeline;
};

const getTweets = async (accounts: IWatchedAccount[], lastTweets: any): Promise<ITweet[]> => {
  const tweets: ITweet[] = [];

  for (const account of accounts) {
    const timeline = await getTimeline(account, lastTweets);
    tweets.push(...timeline);
  }

  return tweets;
};

const getTweetsFromNogizaka = async (accounts: IWatchedAccount[], lastTweets: any): Promise<ITweet[]> => {
  const tweets = await getTweets(accounts, lastTweets);

  return tweets;
};

const getNogizakaTweetsFromMedia = async (accounts: IWatchedAccount[], lastTweets: any): Promise<ITweet[]> => {
  const tweets = await getTweets(accounts, lastTweets);
  const nogizakaRelatedTweets = tweets.filter(relatesToNogizaka);

  return nogizakaRelatedTweets;
};

const getNogizakaShowroomSchedules = async (account: IWatchedAccount, lastTweets: any): Promise<ITweet[]> => {
  const tweets = await getTimeline(account, lastTweets);
  const nogizakaShowroomSchedules = tweets.filter((tweet) => containsShowroomSchedule(tweet.text));

  return nogizakaShowroomSchedules;
};

export const retweetNogizakaRelated = async (
  nogizakaAccounts: IWatchedAccount[],
  mediaAccounts: IWatchedAccount[],
  showroomAccount: IWatchedAccount,
  lastTweets: any,
) => {
  console.log('[News] Retweet cycle starts.');

  const tweetsFromNogizaka = await getTweetsFromNogizaka(nogizakaAccounts, lastTweets);
  const nogizakaTweetsFromMedia = await getNogizakaTweetsFromMedia(mediaAccounts, lastTweets);
  const showroomScheduleTweets = await getNogizakaShowroomSchedules(showroomAccount, lastTweets);
  const nogizakaRelatedTweets = [...tweetsFromNogizaka, ...showroomScheduleTweets, ...nogizakaTweetsFromMedia];

  nogizakaRelatedTweets.sort((tweetA, tweetB) => (tweetA.createdDate > tweetB.createdDate ? 1 : -1));

  for (const tweet of nogizakaRelatedTweets) {
    try {
      await T.post('statuses/retweet/:id', { id: tweet.id });
      console.log(`[News] Retweet succeeded: ${tweet.id} from ${tweet.userName}`);
    } catch (err) {
      console.log('[News] Retweet failed:', err.message);
    }
  }

  if (nogizakaRelatedTweets.length === 0) {
    console.log('[News] No new tweets.');
  }

  console.log('[News] Retweet cycle finished.\n');

  console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${getMillisecondsTilNextTime(1) / 1000} sec\n`);
};
