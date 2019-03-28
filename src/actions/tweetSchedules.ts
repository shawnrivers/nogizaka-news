import { getSchedules } from '../actions/nogizaka';
import { getToday, IDate, getOneDigitDate } from '../utils/date';
import { ITypeSchedules } from '../utils/types';
import { getStringLength } from '../utils/string';
import { T } from '../utils/twit';

const formatSchedule = (schedules: ITypeSchedules[], today: IDate): string[] => {
  const formattedTweets: string[] = [];

  let threadCount = 1;
  const schedulesTextHeading = `${getOneDigitDate(today.month)}月${getOneDigitDate(today.day)}日のスケジュール\n`;
  let schedulesText = schedulesTextHeading;

  for (const typeSchedule of schedules) {
    if (typeSchedule.data.length > 0) {
      const typeScheduleHeading = `\n【${typeSchedule.type.displayName}】\n`;
      schedulesText += typeScheduleHeading;

      for (let i = 0; i < typeSchedule.data.length; i++) {
        const schedule = typeSchedule.data[i];

        if (getStringLength(schedulesText + schedule + '\n') <= 275) {
          schedulesText += `${i + 1}. ${schedule}\n`;
        } else {
          threadCount += 1;

          if (i === 0) {
            // If the text count exceeds the limits when only adding the schedule type text,
            // then omit the schedule type text.
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

export const tweetTodaySchedules = async () => {
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
