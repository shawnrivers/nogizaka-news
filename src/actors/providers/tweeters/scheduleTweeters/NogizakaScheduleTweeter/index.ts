import * as Twit from 'twit';
import { NOGIZAKA_SCHEDULE_TYPES } from '../../../../../constants/schedules';
import { getOneDigitDate } from '../../../../../utils/date';
import { BaseScheduleTweeter } from '../BaseScheduleTweeter';
import { getTweetableSchedulesWithType } from '../BaseScheduleTweeter/converters';
import { ScheduleDate, ScheduleWithType } from '../BaseScheduleTweeter/types';
import axios from 'axios';

type ScheduleResponse = {
  data: {
    cate: string;
    date: string;
    start_time: string;
    end_time: string;
    title: string;
  }[];
};

export class NogizakaScheduleTweeter extends BaseScheduleTweeter {
  constructor(twitter: Twit) {
    super(twitter);
  }

  public async start(date: ScheduleDate): Promise<void> {
    const schedules = await this.getSchedules(date);
    const formattedSchedules = this.formatSchedules({ schedules, date });
    this.tweetPoster.tweetThread(formattedSchedules);
  }

  public async getSchedules(date: ScheduleDate): Promise<ScheduleWithType[]> {
    const { year, month, day } = date;

    const schedules: ScheduleWithType[] = [];

    try {
      const response = await axios.get(
        `https://www.nogizaka46.com/s/n46/api/list/schedule?dy=${year}${month}&callback=res`,
      );

      const { data } = JSON.parse(response.data.slice(4).slice(0, -2)) as ScheduleResponse;

      const dayData = data.filter((item) => item.date === `${year}/${month}/${day}`);

      for (const NogizakaScheduleType of NOGIZAKA_SCHEDULE_TYPES) {
        const schedulesByType: string[] = [];

        dayData
          .filter((data) => data.cate === NogizakaScheduleType.type)
          .forEach((data) => {
            const durationText = `${data.start_time}〜${data.end_time}`;
            const text = durationText !== `〜` ? `${durationText} ${data.title}` : data.title;

            schedulesByType.push(text);
          });

        schedules.push({
          type: NogizakaScheduleType.displayName,
          schedule: schedulesByType,
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return schedules;
  }

  private formatSchedules({ schedules, date }: { schedules: ScheduleWithType[]; date: ScheduleDate }): string[] {
    const heading = `${getOneDigitDate(date.month)}月${getOneDigitDate(date.day)}日のスケジュール`;

    return getTweetableSchedulesWithType({ schedules, heading });
  }

  public async getFormattedSchedules(date: ScheduleDate): Promise<string[]> {
    const schedules = await this.getSchedules(date);
    const formattedSchedules = this.formatSchedules({ schedules, date });
    return formattedSchedules;
  }
}
