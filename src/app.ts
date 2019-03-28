import { retweetNogizakaRelated } from './actions/retweetNews';
import { tweetTodaySchedules } from './actions/tweetSchedules';
import { NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT } from './utils/constants';
import { getMillisecondsTilTomorrowAt, getCurrentFullDate } from './utils/date';

const watchAndRetweet = (interval: number) => {
  retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT);
  setInterval(() => retweetNogizakaRelated(NOGIZAKA_RELATED_ACCOUNTS, NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT), interval);
};

const scheduleTweet = (hour: number) => {
  let nextTweetTimeout = getMillisecondsTilTomorrowAt(hour);
  
  console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimeout / 1000} sec\n`);
  
  const timeoutTweet = async () => {
    console.log("[Schedules] Started tweeting today's schedules.");
    
    await tweetTodaySchedules();
    
    console.log("[Schedules] Today's schedules tweeting finished at Tokyo time:", getCurrentFullDate());
    
    nextTweetTimeout = getMillisecondsTilTomorrowAt(hour);
    console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimeout / 1000} sec\n`);
    setTimeout(timeoutTweet, nextTweetTimeout);
  };
  
  setTimeout(() => timeoutTweet(), nextTweetTimeout);
};

const TWEET_SCHEDULE_HOUR = 1;
const TWEET_INTERVAL = 1000 * 60 * 15;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL);