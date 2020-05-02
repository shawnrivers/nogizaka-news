import { Schedule } from '../NogizakaScheduleTweeter';
import { getStringLength } from '../../../../../utils/string';

const TWEET_MAX_TEXT = 275;

type GetTweetableSchedulesWithType = (params: { schedules: Schedule[]; heading: string }) => string[];

export const getTweetableSchedulesWithType: GetTweetableSchedulesWithType = ({ schedules, heading }) => {
  const formattedTweets: string[] = [];

  let threadCount = 1;
  let schedulesText = heading + '\n';

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

          const subsequentThreadHeading = `${heading.slice(0, -1)}（${threadCount}）\n${typeScheduleHeading}`;

          schedulesText = subsequentThreadHeading + `${i + 1}. ${schedule}\n`;
        }
      }
    }
  }

  if (schedulesText !== heading) {
    schedulesText = schedulesText.slice(0, -1);
  } else {
    schedulesText = heading + '\nなし';
  }

  formattedTweets.push(schedulesText);

  return formattedTweets;
};
