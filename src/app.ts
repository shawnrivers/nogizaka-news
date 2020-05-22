import { TextRelativeRetweeter } from './actors/providers/retweeters/TextRelativeRetweeter';
import { GraduatedScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/GraduatedScheduleTweeter';
import { NogizakaScheduleTweeter } from './actors/providers/tweeters/scheduleTweeters/NogizakaScheduleTweeter';
import {
  IKOMA_ACCOUNT,
  KAWAGO_ACCOUNT,
  NEWS_MEDIA_ACCOUNTS,
  NOGIZAKA_ACCOUNTS,
  SHOWROOM_ACCOUNT,
  WAKATSUKI_ACCOUNT,
  NAGASHIMA_ACCOUNT,
  NENE_ACCOUNT,
  HATANAKA_ACCOUNT,
} from './actors/providers/retweeters/TextRelativeRetweeter/accounts';
import { convertHMS, getCurrentFullDate, getMillisecondsTilNextTime, getToday } from './utils/date';
import { cutDecimalPlace } from './utils/number';
import { Twitter } from './utils/twit';

const RETWEET_CYCLE_MIN = 15;
const DAILY_SCHEDULES_CYCLE_HOUR = 1;
const RETWEET_CYCLE_MS = 1000 * 60 * RETWEET_CYCLE_MIN;

const nogizakaRetweeter = new TextRelativeRetweeter({
  twitter: Twitter,
  accounts: NOGIZAKA_ACCOUNTS,
});
const mediaRetweeter = new TextRelativeRetweeter({
  twitter: Twitter,
  accounts: NEWS_MEDIA_ACCOUNTS,
});
const showroomRetweeter = new TextRelativeRetweeter({
  twitter: Twitter,
  accounts: [SHOWROOM_ACCOUNT],
});
const graduatesRetweeter = new TextRelativeRetweeter({
  twitter: Twitter,
  accounts: [IKOMA_ACCOUNT, WAKATSUKI_ACCOUNT, KAWAGO_ACCOUNT, NAGASHIMA_ACCOUNT, NENE_ACCOUNT, HATANAKA_ACCOUNT],
});

const nogizakaScheduleTweeter = new NogizakaScheduleTweeter(Twitter);
const graduatesScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

const retweet = async (): Promise<void> => {
  console.log('[Retweet] Retweet started.');

  const start = new Date().getTime();

  await Promise.all([
    nogizakaRetweeter.start(),
    showroomRetweeter.start(),
    mediaRetweeter.start(),
    graduatesRetweeter.start(),
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

const runRetweetingCycle = (interval: number): void => {
  retweet();

  setInterval(retweet, interval);
};

const tweetDailySchedules = async (): Promise<void> => {
  const today = getToday();

  await nogizakaScheduleTweeter.start(today);
  await graduatesScheduleTweeter.start(today);
};

const runDailySchedulesTweetingCycle = (hour: number): void => {
  let nextTweetTimer = getMillisecondsTilNextTime(hour);
  let nextTweetTimerHMS = convertHMS(nextTweetTimer / 1000);

  console.log(
    `[Schedules] The next schedules tweeting will be in ${nextTweetTimerHMS.hours}h ${
      nextTweetTimerHMS.minutes
    }m ${cutDecimalPlace(nextTweetTimerHMS.seconds, 0)}s.`,
  );

  const timeoutTweet = async (): Promise<void> => {
    console.log("[Schedules] Today's schedules tweeting started.");

    await tweetDailySchedules();

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

  setTimeout(timeoutTweet, nextTweetTimer);
};

runDailySchedulesTweetingCycle(DAILY_SCHEDULES_CYCLE_HOUR);
runRetweetingCycle(RETWEET_CYCLE_MS);
