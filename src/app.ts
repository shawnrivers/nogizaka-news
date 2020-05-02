import { MediaRetweeter } from './actors/providers/retweeters/MediaRetweeter';
import { NogizakaRetweeter } from './actors/providers/retweeters/NogizakaRetweeter';
import { ShowroomRetweeter } from './actors/providers/retweeters/ShowroomRetweeter';
import { GraduatedScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/GraduatedScheduleTweeter';
import { NogizakaScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/NogizakaScheduleTweeter';
import { getCurrentFullDate, getMillisecondsTilNextTime, getToday, convertHMS } from './utils/date';
import { Twitter } from './utils/twit';
import { cutDecimalPlace } from './utils/number';

const nogizakaRetweeter = new NogizakaRetweeter(Twitter);
const mediaRetweeter = new MediaRetweeter(Twitter);
const showroomRetweeter = new ShowroomRetweeter(Twitter);
const nogizakaScheduleTweeter = new NogizakaScheduleTweeter(Twitter);
const graduatesScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

const retweet = async (): Promise<void> => {
  console.log('[News] Retweet cycle starts.');

  const start = new Date().getTime();

  await nogizakaRetweeter.start();
  await showroomRetweeter.start();
  await mediaRetweeter.start();

  const retweetTookTime = new Date().getTime() - start;
  console.log(`[News] Retweet cycle finished. Done in ${cutDecimalPlace(retweetTookTime / 1000, 2)}s.\n`);

  const nextTweetTimer = convertHMS(getMillisecondsTilNextTime(1) / 1000);
  console.log(
    `[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimer.hours}h ${
      nextTweetTimer.minutes
    }m ${cutDecimalPlace(nextTweetTimer.seconds, 0)}s.\n`,
  );
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
  let nextTweetTimer = getMillisecondsTilNextTime(hour);
  let nextTweetTimerHMS = convertHMS(nextTweetTimer / 1000);

  console.log(
    `[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimerHMS.hours}h ${
      nextTweetTimerHMS.minutes
    }m ${cutDecimalPlace(nextTweetTimerHMS.seconds, 0)}s.\n`,
  );

  const timeoutTweet = async (): Promise<void> => {
    console.log("[Schedules] Started tweeting today's schedules.");

    await tweetTodaysSchedules();

    console.log("[Schedules] Today's schedules tweeting finished at Tokyo time:", getCurrentFullDate());

    nextTweetTimer = getMillisecondsTilNextTime(hour);
    nextTweetTimerHMS = convertHMS(nextTweetTimer / 1000);

    console.log(
      `[Schedules] Tomorrow's schedules will be tweeted after ${nextTweetTimerHMS.hours}h ${
        nextTweetTimerHMS.minutes
      }m ${cutDecimalPlace(nextTweetTimerHMS.seconds, 0)}s.\n`,
    );

    setTimeout(timeoutTweet, nextTweetTimer);
  };

  setTimeout(() => timeoutTweet(), nextTweetTimer);
};

const TWEET_SCHEDULE_HOUR = 1;
const TWEET_INTERVAL = 1000 * 60 * 0.5;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL);
