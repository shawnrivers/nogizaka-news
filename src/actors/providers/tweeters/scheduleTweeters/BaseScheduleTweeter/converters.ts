import { getStringLength } from '../../../../../utils/string';
import { ScheduleWithType } from './types';

const TWEET_MAX_TEXT = 275;

type GetTweetableSchedulesWithType = (params: { schedules: ScheduleWithType[]; heading: string }) => string[];

export const getTweetableSchedulesWithType: GetTweetableSchedulesWithType = ({ schedules, heading }) => {
  const formattedTweets: string[] = [];

  let threadCount = 1;
  const headingWithNewLine = heading + '\n';
  let schedulesText = headingWithNewLine;

  for (const typeSchedule of schedules) {
    if (typeSchedule.schedule.length > 0) {
      const typeScheduleHeading = `\n【${typeSchedule.type}】\n`;
      schedulesText += typeScheduleHeading;

      for (let i = 0; i < typeSchedule.schedule.length; i++) {
        const schedule = typeSchedule.schedule[i];

        if (getStringLength(schedulesText + schedule + '\n') <= TWEET_MAX_TEXT) {
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

          const subsequentThreadHeading = `${heading}（${threadCount}）\n${typeScheduleHeading}`;

          schedulesText = subsequentThreadHeading + `${i + 1}. ${schedule}\n`;
        }
      }
    }
  }

  if (schedulesText !== headingWithNewLine) {
    schedulesText = schedulesText.slice(0, -1);
  } else {
    schedulesText = headingWithNewLine + '\nなし';
  }

  formattedTweets.push(schedulesText);

  return formattedTweets;
};
