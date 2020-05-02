import * as cheerio from 'cheerio';
import * as req from 'request-promise';
import { GRADUATES_SCHEDULE_TYPE_LIST, NOGIZAKA_SCHEDULE_TYPES } from '../utils/constants';
import { compareDates, IDate } from '../utils/date';
import { ITypeSchedule, ITypeSchedules } from '../utils/types';

const getDaySchedules = (html: any, day: string): ITypeSchedules[] => {
  const schedules: ITypeSchedules[] = [];

  const $ = cheerio.load(html);
  const dayElement = $(`#d${day}`);

  for (const NogizakaScheduleType of NOGIZAKA_SCHEDULE_TYPES) {
    const typeSchedulesData = [];
    const typeSchedulesElement = dayElement.find(NogizakaScheduleType.className).get();

    if (typeSchedulesElement.length !== 0) {
      for (const typeScheduleElement of typeSchedulesElement) {
        const scheduleData = typeScheduleElement.children[0].data;
        typeSchedulesData.push(scheduleData);
      }
    }

    const typeSchedules = {
      type: NogizakaScheduleType.displayName,
      data: typeSchedulesData,
    };
    schedules.push(typeSchedules);
  }

  return schedules;
};

export const getNogizakaSchedules = async (date: IDate): Promise<ITypeSchedules[]> => {
  let schedules: ITypeSchedules[] = [];

  const url = `http://www.nogizaka46.com/schedule/?to=${date.year}${date.month}`;

  await req(url)
    .then((html) => {
      schedules = getDaySchedules(html, date.day);
    })
    .catch((err) => {
      console.log('Error:', err);
    });

  return schedules;
};

export const getGraduatesSchedules = async (date: IDate): Promise<ITypeSchedules[]> => {
  const { year, month, day } = date;

  const urlNishino = {
    memberName: '西野七瀬',
    url: `https://nishinonanase.com/s/m04/media/list?ima=2551&dy=${year}${month}`,
  };
  const urlIkoma = {
    memberName: '生駒里奈',
    url: `https://ikomarina.com/s/m01/media/list?ima=2925&dy=${year}${month}`,
  };
  const urlWakatsuki = {
    memberName: '若月佑美',
    url: `https://wakatsukiyumi.jp/s/m05/media/list?ima=2814&dy=${year}${month}`,
  };
  const urlObjects = [urlNishino, urlIkoma, urlWakatsuki];

  const normalizedSchedules: ITypeSchedules[] = [];
  const rawSchedules: ITypeSchedule[] = [];

  for (const urlObj of urlObjects) {
    const { memberName } = urlObj;

    const memberSchedules: ITypeSchedule[] = [];

    try {
      const html = await req(urlObj.url);
      const $ = cheerio.load(html);

      const dateDay = year + month + day;
      const dayElements = $(`[data-day=${dateDay}]`);
      const dayElement = dayElements.find('.list_card');

      dayElement.map((_, element) => {
        const type = $(element).find('.category').text();
        const date = $(element).find('.date').text();
        const title = $(element).find('.title').text();

        memberSchedules.push({
          type,
          schedule: { date, title, memberName },
        });
      });

      rawSchedules.push(...memberSchedules);
    } catch (err) {
      console.log('Error:', err);
    }
  }

  for (let i = 0; i < GRADUATES_SCHEDULE_TYPE_LIST.length; i++) {
    const scheduleType = GRADUATES_SCHEDULE_TYPE_LIST[i];

    normalizedSchedules.push({
      type: scheduleType,
      data: [],
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

      normalizedSchedules[i].data.push(scheduleText);
    }
  }

  return normalizedSchedules;
};
