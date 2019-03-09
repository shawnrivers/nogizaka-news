import * as cheerio from 'cheerio';
import { scheduleTypes } from '../utils/constants';
import { ITypeSchedules } from '../utils/types';
import { nogizakaNames } from '../utils/constants';

export const relatesToNogizaka = (text: string): boolean => {
  if (text !== undefined) {
    for (const name of nogizakaNames) {
      if (text.includes(name)) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

const getDaySchedules = (html: any, day: string): ITypeSchedules[] => {
  let schedules: ITypeSchedules[] = [];

  const $ = cheerio.load(html);
  const dayElement = $(`#d${day}`);

  for (const scheduleType of scheduleTypes) {
    let typeSchedulesData = [];
    const typeSchedulesElement = dayElement.find(scheduleType.className).get();

    if (typeSchedulesElement.length !== 0) {
      for (const typeScheduleElement of typeSchedulesElement) {
        const scheduleData = typeScheduleElement.children[0].data;
        typeSchedulesData.push(scheduleData);
      }
    }

    const typeSchedules = {
      type: {
        name: scheduleType.type,
        displayName: scheduleType.displayName,
      },
      data: typeSchedulesData,
    };
    schedules.push(typeSchedules);
  }

  return schedules;
};

