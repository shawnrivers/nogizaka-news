import { GraduatedScheduleTweeter } from '..';
import { Twitter } from '../../../../../../utils/twit';
import { ScheduleWithTypeLLC, ScheduleWithType } from '../../BaseScheduleTweeter/types';

describe('GraduatedScheduleTweeter', () => {
  const graduatedScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

  let nanaseSchedules: ScheduleWithTypeLLC[] = [];
  let ikomaSchedules: ScheduleWithTypeLLC[] = [];
  let allSchedules: ScheduleWithType[] = [];

  beforeAll(() => {
    return Promise.all([
      graduatedScheduleTweeter.getNishinoSchedules({ year: '2020', month: '12', day: '22' }).then((schedules) => {
        nanaseSchedules = schedules;
      }),
      graduatedScheduleTweeter.getIkomaSchedules({ year: '2020', month: '12', day: '13' }).then((schedules) => {
        ikomaSchedules = schedules;
      }),
      graduatedScheduleTweeter.getSchedules({ year: '2020', month: '11', day: '21' }).then((schedules) => {
        allSchedules = schedules;
      }),
    ]);
  });

  it("should get the Nanase's schedules", () => {
    expect(nanaseSchedules).toEqual([
      {
        type: 'TV',
        schedule: {
          date: '24:25～24:55',
          title: '関西テレビ「グータンヌーボ2」',
          memberName: '西野七瀬',
        },
      },
      {
        type: 'MAGAZINE',
        schedule: {
          date: '',
          title: '「FLASH」',
          memberName: '西野七瀬',
        },
      },
    ]);
  });

  it("should get Ikoma's schedules", async () => {
    expect(ikomaSchedules).toEqual([
      {
        type: 'Event',
        schedule: {
          date: '',
          title: 'e-sports BIKEイベント「MOVING2020 決勝戦」ゲスト出演',
          memberName: '生駒里奈',
        },
      },
      {
        type: 'YouTube',
        schedule: {
          date: '',
          title: '「MOVING 2020」決勝大会 2日目',
          memberName: '生駒里奈',
        },
      },
      {
        type: 'Magazine/Web',
        schedule: {
          date: '',
          title: 'ニコニコ生放送「トゥーランドット～廃墟に眠る少年の夢～」',
          memberName: '生駒里奈',
        },
      },
    ]);
  });

  it("should get all graduated members' schedules", () => {
    expect(allSchedules).toEqual([
      {
        type: 'TV',
        schedule: ['9:55～10:25 フジテレビ系「ライオンのグータッチ」 西野七瀬'],
      },
      {
        type: 'RADIO',
        schedule: [],
      },
      {
        type: 'MAGAZINE',
        schedule: [],
      },
      {
        type: 'WEB',
        schedule: [],
      },
      {
        type: 'STAGE',
        schedule: [],
      },
      {
        type: 'EVENT',
        schedule: [],
      },
      {
        type: 'OTHER',
        schedule: ['YouTube「IKOMACHANNEL」 生駒里奈'],
      },
    ]);
  });
});
