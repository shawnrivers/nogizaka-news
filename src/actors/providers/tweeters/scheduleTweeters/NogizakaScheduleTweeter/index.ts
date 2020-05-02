import * as Twit from 'twit';
import { NOGIZAKA_SCHEDULE_TYPES } from '../../../../../constants/schedules';
import { getOneDigitDate } from '../../../../../utils/date';
import { BaseScheduleTweeter } from '../BaseScheduleTweeter';
import { getTweetableSchedulesWithType } from '../BaseScheduleTweeter/converters';
import { ScheduleDate, ScheduleWithType } from '../BaseScheduleTweeter/types';

export class NogizakaScheduleTweeter extends BaseScheduleTweeter {
  constructor(twitter: Twit) {
    super(twitter);
  }

  public async start(date: ScheduleDate): Promise<void> {
    const schedules = await this.getSchedules(date);
    const formattedSchedules = this.formatSchedules({ schedules, date });
    this.tweetPoster.tweetThread(formattedSchedules);
  }

  private async getSchedules(date: ScheduleDate): Promise<ScheduleWithType[]> {
    const schedules = [];
    const url = `https://www.nogizaka46.com/schedule/?to=${date.year}${date.month}`;
    const $ = await this.addDOMSelector({ url, scraperId: 'nogizaka' });

    if ($ !== null) {
      const dayElement = $(`#d${date.day}`);

      for (const NogizakaScheduleType of NOGIZAKA_SCHEDULE_TYPES) {
        const typeSchedulesData = [];
        const typeSchedulesElement = dayElement.find(NogizakaScheduleType.className).get();

        if (typeSchedulesElement.length !== 0) {
          for (const typeScheduleElement of typeSchedulesElement) {
            const scheduleData = typeScheduleElement.children[0].data as string;
            typeSchedulesData.push(scheduleData);
          }
        }

        const typeSchedules = {
          type: NogizakaScheduleType.displayName,
          schedule: typeSchedulesData,
        };
        schedules.push(typeSchedules);
      }
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
