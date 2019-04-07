import * as req from 'request-promise';
import * as cheerio from 'cheerio';
import { compareDates, IDate } from '../utils/date';
import { NOGIZAKA_NAMES, NOGIZAKA_SCHEDULE_TYPES, GRADUATES_SCHEDULE_TYPE_LIST } from '../utils/constants';
import { ITypeSchedules, ITypeSchedule } from '../utils/types';
import { containsHour } from '../utils/string';

export const relatesToNogizaka = (text: string): boolean => {
  if (text !== undefined) {
    for (const name of NOGIZAKA_NAMES) {
      if (text.includes(name)) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

export const containsShowroomSchedule = (text: string): boolean => {
  if (text !== undefined) {
    if (text.includes('のぎおび') && containsHour(text)) {
      return true;
    }
  }
  return false;
};

const getDaySchedules = (html: any, day: string): ITypeSchedules[] => {
  let schedules: ITypeSchedules[] = [];

  const $ = cheerio.load(html);
  const dayElement = $(`#d${day}`);

  for (const NogizakaScheduleType of NOGIZAKA_SCHEDULE_TYPES) {
    let typeSchedulesData = [];
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

export const getSchedules = async (date: IDate): Promise<ITypeSchedules[]> => {
  let schedules: ITypeSchedules[] = [];

  const url = `http://www.nogizaka46.com/schedule/?to=${date.year}${date.month}`;

  await req(url)
    .then(html => {
      schedules = getDaySchedules(html, date.day);
    })
    .catch(err => {
      console.log('Error:', err);
    });

  return schedules;
};
