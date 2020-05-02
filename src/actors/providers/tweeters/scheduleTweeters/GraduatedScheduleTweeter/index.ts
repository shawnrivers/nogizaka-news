import * as Twit from 'twit';
import { LLC_SCHEDULE_TYPE_LIST } from '../../../../../utils/constants';
import { compareDates, getOneDigitDate } from '../../../../../utils/date';
import { BaseScheduleTweeter } from '../BaseScheduleTweeter';
import { getTweetableSchedulesWithType } from '../BaseScheduleTweeter/converters';
import { ScheduleDate, ScheduleWithType, ScheduleWithTypeLLC } from '../BaseScheduleTweeter/types';
import { NogizakaName } from '../../../../../constants/names';

export class GraduatedScheduleTweeter extends BaseScheduleTweeter {
  constructor(twitter: Twit) {
    super(twitter);
  }

  public async start(date: ScheduleDate): Promise<void> {
    const schedules = await this.getSchedules(date);
    const formattedSchedules = this.formatSchedules({ schedules, date });
    this.tweetPoster.tweetThread(formattedSchedules);
  }

  private async getSchedules(date: ScheduleDate): Promise<ScheduleWithType[]> {
    const nishinoSchedules = await this.getNishinoSchedules(date);
    const ikomaSchedules = await this.getIkomaSchedules(date);
    const rawSchedules = [...nishinoSchedules, ...ikomaSchedules];

    const normalizedSchedules: ScheduleWithType[] = [];

    for (let i = 0; i < LLC_SCHEDULE_TYPE_LIST.length; i++) {
      const scheduleType = LLC_SCHEDULE_TYPE_LIST[i];

      normalizedSchedules.push({
        type: scheduleType,
        schedule: [],
      });

      const schedulesForSorting = [];

      for (const rawSchedule of rawSchedules) {
        if (rawSchedule.type === scheduleType) {
          schedulesForSorting.push(rawSchedule.schedule);
        }
      }

      schedulesForSorting.sort((scheduleA, scheduleB) => compareDates(scheduleA.date, scheduleB.date));

      for (const scheduleForSorting of schedulesForSorting) {
        const scheduleText =
          scheduleForSorting.date !== ''
            ? `${scheduleForSorting.date} ${scheduleForSorting.title} ${scheduleForSorting.memberName}`
            : `${scheduleForSorting.title} ${scheduleForSorting.memberName}`;

        normalizedSchedules[i].schedule.push(scheduleText);
      }
    }

    return normalizedSchedules;
  }

  private formatSchedules({ schedules, date }: { schedules: ScheduleWithType[]; date: ScheduleDate }): string[] {
    const heading = `卒業生の${getOneDigitDate(date.month)}月${getOneDigitDate(date.day)}日のスケジュール`;

    return getTweetableSchedulesWithType({ schedules, heading });
  }

  private getNishinoSchedules(date: ScheduleDate): Promise<ScheduleWithTypeLLC[]> {
    const url = `https://nishinonanase.com/s/m04/media/list?ima=2551&dy=${date.year}${date.month}`;

    return this.getLLCMemberSchedule({ date, url, scraperId: 'nishino', memberName: NogizakaName.NishinoNanase });
  }

  private getIkomaSchedules(date: ScheduleDate): Promise<ScheduleWithTypeLLC[]> {
    const url = `https://ikomarina.com/s/m01/media/list?ima=2925&dy=${date.year}${date.month}`;

    return this.getLLCMemberSchedule({ date, url, scraperId: 'ikoma', memberName: NogizakaName.IkomaRina });
  }

  private async getLLCMemberSchedule({
    date,
    url,
    scraperId,
    memberName,
  }: {
    date: ScheduleDate;
    url: string;
    scraperId: string;
    memberName: string;
  }): Promise<ScheduleWithTypeLLC[]> {
    const LLCSchedules: ScheduleWithTypeLLC[] = [];
    const { year, month, day } = date;

    try {
      const $ = await this.addDOMSelector({ url, scraperId });

      if ($ !== null) {
        const dateDay = year + month + day;
        const dayElements = $(`[data-day=${dateDay}]`);
        const dayElement = dayElements.find('.list_card');

        dayElement.map((_, element) => {
          const type = $(element).find('.category').text();
          const date = $(element).find('.date').text();
          const title = $(element).find('.title').text();

          LLCSchedules.push({
            type,
            schedule: { date, title, memberName },
          });
        });
      }
    } catch (err) {
      console.log('Error:', err);
    }

    return LLCSchedules;
  }
}
