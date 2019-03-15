import { getSchedules } from '../actions/nogizaka';
import { getToday, IDate, getOneDigitDate, getMillisecondsTilTomorrowAt, getCurrentFullDate } from '../utils/date';
import { ITypeSchedules } from '../utils/types';
import { getStringLength } from '../utils/string';
import { T } from '../utils/twit';

const formatSchedule = (schedules: ITypeSchedules[], today: IDate): string[] => {
  let formattedTweets: string[] = [];

  let threadCount = 1;
  const schedulesTextHeading = `${getOneDigitDate(today.month)}月${getOneDigitDate(today.day)}日のスケジュール\n`;
  let schedulesText = schedulesTextHeading;

  for (const typeSchedule of schedules) {
    if (typeSchedule.data.length > 0) {
      const typeScheduleHeading = `\n【${typeSchedule.type.displayName}】\n`;
      schedulesText += typeScheduleHeading;

      for (let i = 0; i < typeSchedule.data.length; i++) {
        const schedule = typeSchedule.data[i];

        if (getStringLength(schedulesText + schedule + '\n') <= 280) {
          schedulesText += `${i + 1}. ${schedule}\n`;
        } else {
          threadCount += 1;

          if (i === 0) {
            // If the text count exceeds the limits when only adding the schedule type text,
            // then omit the schdule type text.
            formattedTweets.push(schedulesText.slice(0, -(typeScheduleHeading.length + 1)));
          } else {
            formattedTweets.push(schedulesText.slice(0, -1));
          }

          const subsequentThreadHeading = `${schedulesTextHeading.slice(
            0,
            -1,
          )}（${threadCount}）\n${typeScheduleHeading}`;

          schedulesText = subsequentThreadHeading + `${i + 1}. ${schedule}\n`;
        }
      }
    }
  }

  if (schedulesText !== schedulesTextHeading) {
    schedulesText = schedulesText.slice(0, -1);
  } else {
    schedulesText = schedulesTextHeading + '\nなし';
  }

  formattedTweets.push(schedulesText);

  return formattedTweets;
};

const tweetTodaySchedules = async () => {
  const today = getToday();

  const schedules = await getSchedules(today);
  const formattedSchedules = formatSchedule(schedules, today);

  let firstTweetID: string = '';

  for (let i = 0; i < formattedSchedules.length; i++) {
    const formattedSchedule = formattedSchedules[i];

    const params = {
      status: formattedSchedule,
    };

    if (i === 0) {
      try {
        const response: any = await T.post('statuses/update', params);
        firstTweetID = response.data.id_str;
      } catch (err) {
        console.log('Error:', err);
        throw err;
      }
    } else {
      const params = {
        status: formattedSchedule,
        in_reply_to_status_id: firstTweetID,
      };

      try {
        const response: any = await T.post('statuses/update', params);
        firstTweetID = response.data.id_str;
      } catch (err) {
        console.log('Error:', err);
        throw err;
      }
    }
  }
};

export const scheduleTweet = (hour: number) => {
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
