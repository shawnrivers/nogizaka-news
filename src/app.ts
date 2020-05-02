import { MediaRetweeter } from './actors/providers/retweeters/MediaRetweeter';
import { NogizakaRetweeter } from './actors/providers/retweeters/NogizakaRetweeter';
import { ShowroomRetweeter } from './actors/providers/retweeters/ShowroomRetweeter';
import { GraduatedScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/GraduatedScheduleTweeter';
import { NogizakaScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/NogizakaScheduleTweeter';
import { getCurrentFullDate, getMillisecondsTilNextTime, getToday } from './utils/date';
import { Twitter } from './utils/twit';

const nogizakaRetweeter = new NogizakaRetweeter(Twitter);
const mediaRetweeter = new MediaRetweeter(Twitter);
const showroomRetweeter = new ShowroomRetweeter(Twitter);
const nogizakaScheduleTweeter = new NogizakaScheduleTweeter(Twitter);
const graduatesScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

const retweet = async (): Promise<void> => {
  console.log('[News] Retweet cycle starts.');

  await nogizakaRetweeter.start();
  await showroomRetweeter.start();
  await mediaRetweeter.start();

  console.log('[News] Retweet cycle finished.\n');

  console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${getMillisecondsTilNextTime(1) / 1000} sec\n`);
};

const watchAndRetweet = (interval: number): void => {
  retweet();

  setInterval(() => {
    retweet();
  }, interval);
};

const tweetTodaysSchedules = async (): Promise<void> => {
  const today = getToday();

  await nogizakaScheduleTweeter.start(today);
  await graduatesScheduleTweeter.start(today);
};

const scheduleTweet = (hour: number): void => {
  let nextTweetTimeout = getMillisecondsTilNextTime(hour);

  console.log(`[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimeout / 1000} sec\n`);

  const timeoutTweet = async (): Promise<void> => {
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
const TWEET_INTERVAL = 1000 * 60 * 0.5;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL);
