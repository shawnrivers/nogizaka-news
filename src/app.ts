import { retweetNogizakaRelated } from './actions/retweetNews';
import { tweetTodaysSchedules } from './actions/tweetSchedules';
import { NEWS_MEDIA_ACCOUNTS, NOGIZAKA_RELATED_ACCOUNTS, SHOWROOM_ACCOUNT } from './utils/constants';
import { getCurrentFullDate, getMillisecondsTilNextTime } from './utils/date';
import { getInitialLastTweets } from './utils/lastTweets';

let lastTweets = getInitialLastTweets();

const watchAndRetweet = (interval: number, lastTweets: any) => {
  retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT, lastTweets);
  setInterval(
    () => retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT, lastTweets),
    interval,
  );
};

const scheduleTweet = (hour: number) => {
  let nextTweetTimeout = getMillisecondsTilNextTime(hour);

  console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimeout / 1000} sec\n`);

  const timeoutTweet = async () => {
    console.log("[Schedules] Started tweeting today's schedules.");

    await tweetTodaysSchedules();

    console.log("[Schedules] Today's schedules tweeting finished at Tokyo time:", getCurrentFullDate());

    nextTweetTimeout = getMillisecondsTilNextTime(hour);
    console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimeout / 1000} sec\n`);
    setTimeout(timeoutTweet, nextTweetTimeout);
  };

  setTimeout(() => timeoutTweet(), nextTweetTimeout);
};

const TWEET_SCHEDULE_HOUR = 1;
const TWEET_INTERVAL = 1000 * 60 * 15;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL, lastTweets);
