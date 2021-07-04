import * as Twit from 'twit';
import { NogizakaName } from '../../../../../constants/names';
import { LLC_SCHEDULE_TYPE_LIST } from '../../../../../constants/schedules';
import { compareDates, getOneDigitDate } from '../../../../../utils/date';
import { BaseScheduleTweeter } from '../BaseScheduleTweeter';
import { getTweetableSchedulesWithType } from '../BaseScheduleTweeter/converters';
import { ScheduleDate, ScheduleWithType, MemberScheduleWithType, MemberSchedule } from '../BaseScheduleTweeter/types';
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
    const rawSchedules = (
      await Promise.all([
        this.getNishinoSchedules(date),
        this.getShiraishiSchedules(date),
        this.getMarikaSchedules(date),
        this.getIkomaSchedules(date),
        this.getWakatsukiSchedules(date),
        this.getFukagawaSchedules(date),
        this.getMionaSchedules(date),
      ])
    ).flat();

    const denormalizedSchedules: Record<
      string,
      {
        type: string;
        schedule: MemberSchedule[];
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

  public async getNishinoSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = `https://nishinonanase.com/s/m04/media/list?ima=2551&dy=${year}${month}`;
    const nishinoSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'nishinonanase' });

      if ($ !== null) {
        const dateDay = year + month + day;
        const dayElements = $(`[data-day=${dateDay}] .list_card`);

        dayElements.map((_, element) => {
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

  public async getShiraishiSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = `https://maishiraishi-official.com/s/ms/media/list?dy=${year}${month}`;
    const shiraishiSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'shiraishimai' });

      if ($ !== null) {
        const dayElements = $(`.list_card > a[href*="year=${year}&mont=${month}&day=${day}"]`);

        dayElements.map((_, element) => {
          const type = $(element).find('.category').text().trim();
          const date = $(element).find('.date').text().trim();
          const title = $(element).find('.title').text().trim();

          shiraishiSchedules.push({
            type,
            schedule: { date, title, memberName: NogizakaName.ShiraishiMai },
          });
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return shiraishiSchedules;
  }

  public async getMarikaSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = `https://itomarika.com/s/m03/media/list?dy=${year}${month}`;
    const marikaSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'itoumarika' });

      if ($ !== null) {
        const dayElements = $(`.list_card > a[href*="year=${year}&mont=${month}&day=${day}"]`);

        dayElements.map((_, element) => {
          const type = $(element).find('.category').text().trim();
          const date = $(element).find('.date').text().trim();
          const title = $(element).find('.title').text().trim();

          marikaSchedules.push({
            type,
            schedule: { date, title, memberName: NogizakaName.ItouMarika },
          });
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return marikaSchedules;
  }

  public async getIkomaSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = `https://ikomarina.com/schedule/list/${year}/${month}/?cat=L_ALL,live02,live03,live04,live05,live06,live07,live08,live09,live10`;
    const ikomaSchedules: MemberScheduleWithType[] = [];

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

  public async getWakatsukiSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = 'https://yumiwakatsuki.com/';
    const wakatsukiSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'wakatsukiyumi' });

      if ($ !== null) {
        const dayElements = $(`.schedule__item`);

        dayElements.map((_, element) => {
          const type = $(element).find('.schedule__item__date-cat > .cat').text().trim();
          const date = $(element).find('.schedule__item__date-cat > .date').text().trim();
          const title = $(element).find('.schedule__item__paragraph > p').first().text().trim();

          if (date === `${year}/${month}/${day}`) {
            wakatsukiSchedules.push({
              type,
              schedule: { date: '', title, memberName: NogizakaName.WakatsukiYumi },
            });
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return wakatsukiSchedules;
  }

  public async getFukagawaSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = 'https://fukagawamai.com/contents/schedule';
    const fukagawaSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'fukagawamai' });

      if ($ !== null) {
        const dayElements = $(`.contents-list > li`);

        dayElements.map((_, element) => {
          const type = $(element).find('.meta > .tag').text().trim();
          const date = $(element).find('.meta > .time > time').text().trim();
          const title = $(element).find('.contents-list-title').text().trim();

          if (date === `${year}.${month}.${day}`) {
            fukagawaSchedules.push({
              type,
              schedule: { date: '', title, memberName: NogizakaName.FukagawaMai },
            });
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return fukagawaSchedules;
  }

  public async getMionaSchedules(date: ScheduleDate): Promise<MemberScheduleWithType[]> {
    const { year, month, day } = date;
    const url = `https://hori-miona.com/schedule/list/${year}/${month}/`;
    const mionaSchedules: MemberScheduleWithType[] = [];

    try {
      const $ = await this.addDOMSelector({ url, scraperId: 'horimiona' });

      if ($ !== null) {
        const dayElements = $(`.list--schedule > li`);

        dayElements.map((_, element) => {
          const type = $(element).find('.list__txt .category').text().trim();
          const date = $(element).find('.list__date .d').text().trim();
          const title = $(element).find('.list__txt  .tit').text().trim();

          if (date === day) {
            mionaSchedules.push({
              type,
              schedule: { date: '', title, memberName: NogizakaName.HoriMiona },
            });
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }

    return mionaSchedules;
  }
}
