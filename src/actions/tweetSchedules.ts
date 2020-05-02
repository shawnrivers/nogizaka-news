import { getGraduatesSchedules, getNogizakaSchedules } from '../actions/nogizaka';
import { getOneDigitDate, getToday, IDate } from '../utils/date';
import { getStringLength } from '../utils/string';
import { Twitter } from '../utils/twit';
import { ITypeSchedules } from '../utils/types';

export const formatSchedules = (params: {
  schedules: ITypeSchedules[];
  date: IDate;
  isGraduateSchedules?: boolean;
}): string[] => {
  const { schedules, date, isGraduateSchedules } = params;

  const formattedTweets: string[] = [];

  let threadCount = 1;
  const schedulesTextHeading = !isGraduateSchedules
    ? `${getOneDigitDate(date.month)}月${getOneDigitDate(date.day)}日のスケジュール\n`
    : `卒業生の${getOneDigitDate(date.month)}月${getOneDigitDate(date.day)}日のスケジュール\n`;
  let schedulesText = schedulesTextHeading;

  for (const typeSchedule of schedules) {
    if (typeSchedule.data.length > 0) {
      const typeScheduleHeading = `\n【${typeSchedule.type}】\n`;
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

export const tweetFormattedSchedules = async (formattedSchedules: string[]): Promise<void> => {
  let firstTweetID = '';

  for (let i = 0; i < formattedSchedules.length; i++) {
    const formattedSchedule = formattedSchedules[i];

    const params = {
      status: formattedSchedule,
    };

    if (i === 0) {
      try {
        const response: any = await Twitter.post('statuses/update', params);
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
        const response: any = await Twitter.post('statuses/update', params);
        firstTweetID = response.data.id_str;
      } catch (err) {
        console.log('Error:', err);
        throw err;
      }
    }
  }
};

export const tweetTodaysSchedules = async () => {
  const today = getToday();

  const nogizakaSchedules = await getNogizakaSchedules(today);
  const graduatesSchedules = await getGraduatesSchedules(today);

  const formattedNogizakaSchedules = formatSchedules({
    schedules: nogizakaSchedules,
    date: today,
  });
  const formattedGraduatesSchedules = formatSchedules({
    schedules: graduatesSchedules,
    date: today,
    isGraduateSchedules: true,
  });

  await tweetFormattedSchedules(formattedNogizakaSchedules);
  await tweetFormattedSchedules(formattedGraduatesSchedules);
};
