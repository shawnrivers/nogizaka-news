const req = require('request-promise');
const cheerio = require('cheerio');
import { day, month, year } from '../utils/date';

const url = `http://www.nogizaka46.com/schedule/?to=${year}${month}`;

const scheduleTypes = [
  { type: 'live', className: '.live', displayName: 'LIVE/EVENT' },
  { type: 'handshake', className: '.handshake', displayName: '握手会' },
  { type: 'tv', className: '.tv', displayName: 'TV' },
  { type: 'radio', className: '.radio', displayName: 'RADIO' },
  { type: 'magazine', className: '.magazine', displayName: 'MAGZINE' },
  { type: 'web', className: '.web', displayName: 'WEB' },
  { type: 'movie', className: '.movie', displayName: 'MOVIE' },
  { type: 'theatre', className: '.theatre', displayName: 'THEATRE' },
  { type: 'release', className: '.release', displayName: 'REALSE' },
  { type: 'birthday', className: '.bd', displayName: '誕生日' },
];

const getDaySchedules = (html: any) => {
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
