import * as req from 'request-promise';
import * as cheerio from 'cheerio';
import { day, month, year } from '../utils/date';
import { scheduleTypes } from '../utils/constants';
import { ITypeSchedules } from '../utils/types';

const url = `http://www.nogizaka46.com/schedule/?to=${year}${month}`;

const getDaySchedules = (html: any): ITypeSchedules[] => {
  let schedules = [];

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

req(url)
  .then((html: any) => {
    console.log(getDaySchedules(html));
  })
  .catch((err: any) => {
    console.log('Error:', err);
    return null;
  });
