import { T } from '../utils/twit';
import { NEWS_MEDIA_ACCOUNTS, NOGIZAKA_RELATED_ACCOUNTS, SHOWROOM_ACCOUNT } from '../utils/constants';
import { relatesToNogizaka, containsShowroomSchedule } from './nogizaka';
import { IWatchedAccount, ITweet } from '../utils/types';

const getTimeline = async (account: IWatchedAccount): Promise<ITweet[]> => {
  const timeline: ITweet[] = [];
  const params = {
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
        userName: data.user.screen_name,
        text: data.text,
      };

      timeline.push(tweet);
    }
  } catch (err) {
    console.log('Error:', err);
  }

  return timeline;
};

const getTweets = async (accounts: IWatchedAccount[]): Promise<ITweet[]> => {
  const tweets: ITweet[] = [];

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

const getNogizakaShowroomSchedules = async (account: IWatchedAccount): Promise<ITweet[]> => {
  const tweets = await getTimeline(account);
  const nogizakaShowroomSchedules = tweets.filter(tweet => containsShowroomSchedule(tweet.text));

  return nogizakaShowroomSchedules;
};

const retweetNogizakaRelated = async (
  nogizakaAccounts: IWatchedAccount[],
  mediaAccounts: IWatchedAccount[],
  showroomAccount: IWatchedAccount,
) => {
  console.log('[News] Retweet cycle starts.');

  const tweetsFromNogizaka = await getTweetsFromNogizaka(nogizakaAccounts);
  const nogizakaTweetsFromMedia = await getNogizakaTweetsFromMedia(mediaAccounts);
  const showroomScheduleTweets = await getNogizakaShowroomSchedules(showroomAccount);
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

  console.log('[News] Retweet cycle finished.\n');
};

export const watchAndRetweet = (interval: number) => {
  retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT);
  setInterval(() => retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT), interval);
};
