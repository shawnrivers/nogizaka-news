import * as Twit from 'twit';
import { NogizakaName } from '../../../../../constants/names';
import { LLC_SCHEDULE_TYPE_LIST } from '../../../../../constants/schedules';
import { compareDates, getOneDigitDate } from '../../../../../utils/date';
import { BaseScheduleTweeter } from '../BaseScheduleTweeter';
import { getTweetableSchedulesWithType } from '../BaseScheduleTweeter/converters';
import { ScheduleDate, ScheduleWithType, ScheduleWithTypeLLC } from '../BaseScheduleTweeter/types';
import { arrayToObject } from '../../../../../utils/array';

export class GraduatedScheduleTweeter extends BaseScheduleTweeter {
  constructor(twitter: Twit) {
    super(twitter);
  }

  public async start(date: ScheduleDate): Promise<void> {
    const schedules = await this.getSchedules(date);
    const formattedSchedules = this.formatSchedules({ schedules, date });
    this.tweetPoster.tweetThread(formattedSchedules);
  }

  private formatSchedules({ schedules, date }: { schedules: ScheduleWithType[]; date: ScheduleDate }): string[] {
    const heading = `卒業生の${getOneDigitDate(date.month)}月${getOneDigitDate(date.day)}日のスケジュール`;

    return getTweetableSchedulesWithType({ schedules, heading });
  }

  public async getSchedules(date: ScheduleDate): Promise<ScheduleWithType[]> {
    const nishinoSchedules = await this.getNishinoSchedules(date);
    const ikomaSchedules = await this.getIkomaSchedules(date);
    const rawSchedules = [...nishinoSchedules, ...ikomaSchedules];

    const denormalizedSchedules: Record<
      string,
      {
        type: string;
        schedule: {
          title: string;
          date: string;
          memberName: string;
        }[];
      }
    > = arrayToObject(
      LLC_SCHEDULE_TYPE_LIST.map((scheduleType) => ({
        type: scheduleType,
        schedule: [],
      })),
      'type',
    );

    const normalizedSchedules: ScheduleWithType[] = [];

    // Categorize schedules by type
    rawSchedules.forEach((rawSchedule) => {
      const typeIndex = LLC_SCHEDULE_TYPE_LIST.indexOf(rawSchedule.type);

      if (typeIndex !== -1) {
        denormalizedSchedules[LLC_SCHEDULE_TYPE_LIST[typeIndex]].schedule.push(rawSchedule.schedule);
      } else {
        denormalizedSchedules['OTHER'].schedule.push(rawSchedule.schedule);
      }
    });

    // Sort each type of schedules by date
    for (const scheduleType in denormalizedSchedules) {
      denormalizedSchedules[scheduleType].schedule.sort((scheduleA, scheduleB) =>
        compareDates(scheduleA.date, scheduleB.date),
      );
    }

    // Finalize schedules text
    for (const scheduleType in denormalizedSchedules) {
      const normalizedSchedule: ScheduleWithType = {
        type: scheduleType,
        schedule: [],
      };

      denormalizedSchedules[scheduleType].schedule.forEach((denormalizedSchedule) => {
        const scheduleText =
          denormalizedSchedule.date !== ''
            ? `${denormalizedSchedule.date} ${denormalizedSchedule.title} ${denormalizedSchedule.memberName}`
            : `${denormalizedSchedule.title} ${denormalizedSchedule.memberName}`;

        normalizedSchedule.schedule.push(scheduleText);
      });

      normalizedSchedules.push(normalizedSchedule);
    }

    return normalizedSchedules;
  }

  public async getNishinoSchedules(date: ScheduleDate): Promise<ScheduleWithTypeLLC[]> {
    const { year, month, day } = date;
    const url = `https://nishinonanase.com/s/m04/media/list?ima=2551&dy=${year}${month}`;
    const nishinoSchedules: ScheduleWithTypeLLC[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'nishinonanase' });

      if ($ !== null) {
        const dateDay = year + month + day;
        const dayElements = $(`[data-day=${dateDay}]`);
        const dayElement = dayElements.find('.list_card');

        dayElement.map((_, element) => {
          const type = $(element).find('.category').text();
          const date = $(element).find('.date').text();
          const title = $(element).find('.title').text();

          nishinoSchedules.push({
            type,
            schedule: { date, title, memberName: NogizakaName.NishinoNanase },
          });
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return nishinoSchedules;
  }

  public async getIkomaSchedules(date: ScheduleDate): Promise<ScheduleWithTypeLLC[]> {
    const { year, month, day } = date;
    const url = `https://ikomarina.com/schedule/list/${year}/${month}/?cat=L_ALL,live02,live03,live04,live05,live06,live07,live08,live09,live10`;
    const ikomaSchedules: ScheduleWithTypeLLC[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'ikomarina' });

      if ($ !== null) {
        const dayElements = $('ul.list--schedule > li');

        dayElements.map((_, element) => {
          const date = $(element)
            .find('p.date--event')
            .text()
            .trim()
            .replace(/\[[a-zA-Z]+\]/g, '');

          if (date === `${month}.${day}`) {
            const schedulesElements = $(element).find('div.block--txt');

            schedulesElements.map((_, element) => {
              const title = $(element).find('.tit').text().trim();

              let type = $(element).find('.category').text().trim();
              if (type.toUpperCase() === 'TV Show'.toUpperCase()) {
                type = 'TV';
              }

              ikomaSchedules.push({
                type,
                schedule: { date: '', title, memberName: NogizakaName.IkomaRina },
              });
            });
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return ikomaSchedules;
  }
}
