import { IkomaRetweeter } from './actors/providers/retweeters/IkomaRetweeter';
import { KawagoRetweeter } from './actors/providers/retweeters/KawagoRetweeter';
import { MediaRetweeter } from './actors/providers/retweeters/MediaRetweeter';
import { NogizakaRetweeter } from './actors/providers/retweeters/NogizakaRetweeter';
import { ShowroomRetweeter } from './actors/providers/retweeters/ShowroomRetweeter';
import { WakatsukiRetweeter } from './actors/providers/retweeters/WakatsukiRetweeter';
import { GraduatedScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/GraduatedScheduleTweeter';
import { NogizakaScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/NogizakaScheduleTweeter';
import { convertHMS, getCurrentFullDate, getMillisecondsTilNextTime, getToday } from './utils/date';
import { cutDecimalPlace } from './utils/number';
import { Twitter } from './utils/twit';

const RETWEET_CYCLE_MIN = 15;

const nogizakaRetweeter = new NogizakaRetweeter(Twitter);
const mediaRetweeter = new MediaRetweeter(Twitter);
const showroomRetweeter = new ShowroomRetweeter(Twitter);
const ikomaRetweeter = new IkomaRetweeter(Twitter);
const wakatsukiRetweeter = new WakatsukiRetweeter(Twitter);
const kawagoRetweeter = new KawagoRetweeter(Twitter);
const nogizakaScheduleTweeter = new NogizakaScheduleTweeter(Twitter);
const graduatesScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

const retweet = async (): Promise<void> => {
  console.log('[Retweet] Retweet started.');

  const start = new Date().getTime();

  await Promise.all([
    nogizakaRetweeter.start(),
    showroomRetweeter.start(),
    mediaRetweeter.start(),
    ikomaRetweeter.start(),
    wakatsukiRetweeter.start(),
    kawagoRetweeter.start(),
  ]);

  const retweetTookTime = new Date().getTime() - start;
  console.log(`[Retweet] Retweet done ${cutDecimalPlace(retweetTookTime / 1000, 2)}s.`);
  console.log(`[Retweet] The next retweet will be in ${RETWEET_CYCLE_MIN}m.`);

  const nextTweetTimer = convertHMS(getMillisecondsTilNextTime(1) / 1000);
  console.log(
    `[Schedules] The next schedules tweeting will be in ${nextTweetTimer.hours}h ${
      nextTweetTimer.minutes
    }m ${cutDecimalPlace(nextTweetTimer.seconds, 0)}s.`,
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
    `[Schedules] The next schedules tweeting will be in ${nextTweetTimerHMS.hours}h ${
      nextTweetTimerHMS.minutes
    }m ${cutDecimalPlace(nextTweetTimerHMS.seconds, 0)}s.`,
  );

  const timeoutTweet = async (): Promise<void> => {
    console.log("[Schedules] Today's schedules tweeting started.");

    await tweetTodaysSchedules();

    console.log("[Schedules] Today's schedules tweeting finished at Tokyo time:", getCurrentFullDate());

    nextTweetTimer = getMillisecondsTilNextTime(hour);
    nextTweetTimerHMS = convertHMS(nextTweetTimer / 1000);

    console.log(
      `[Schedules] The next schedules tweeting will be in ${nextTweetTimerHMS.hours}h ${
        nextTweetTimerHMS.minutes
      }m ${cutDecimalPlace(nextTweetTimerHMS.seconds, 0)}s.`,
    );

    setTimeout(timeoutTweet, nextTweetTimer);
  };

  setTimeout(() => timeoutTweet(), nextTweetTimer);
};

const TWEET_SCHEDULE_HOUR = 1;
const TWEET_INTERVAL = 1000 * 60 * RETWEET_CYCLE_MIN;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL);
