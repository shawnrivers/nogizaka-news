import { GraduatedScheduleTweeter } from '..';
import { Twitter } from '../../../../../../utils/twit';
import { ScheduleWithTypeLLC, ScheduleWithType } from '../../BaseScheduleTweeter/types';

/**
 * CI doesn't have the tokens to make Twitter requests, so skip it.
 * Run it on local environment.
 */
xdescribe('GraduatedScheduleTweeter', () => {
  const graduatedScheduleTweeter = new GraduatedScheduleTweeter(Twitter);

  let nishinoSchedules: ScheduleWithTypeLLC[] = [];
  let shiraishiSchedules: ScheduleWithTypeLLC[] = [];
  let ikomaSchedules: ScheduleWithTypeLLC[] = [];
  let wakatsukiSchedules: ScheduleWithTypeLLC[] = [];
  let fukagawaSchedules: ScheduleWithTypeLLC[] = [];
  let allSchedules: ScheduleWithType[] = [];

  beforeAll(() => {
    return Promise.all([
      graduatedScheduleTweeter.getNishinoSchedules({ year: '2020', month: '12', day: '22' }).then((schedules) => {
        nishinoSchedules = schedules;
      }),
      graduatedScheduleTweeter.getShiraishiSchedules({ year: '2021', month: '01', day: '01' }).then((schedules) => {
        shiraishiSchedules = schedules;
      }),
      graduatedScheduleTweeter.getIkomaSchedules({ year: '2020', month: '12', day: '13' }).then((schedules) => {
        ikomaSchedules = schedules;
      }),
      graduatedScheduleTweeter.getWakatsukiSchedules({ year: '2021', month: '01', day: '11' }).then((schedules) => {
        wakatsukiSchedules = schedules;
      }),
      graduatedScheduleTweeter.getFukagawaSchedules({ year: '2021', month: '01', day: '29' }).then((schedules) => {
        fukagawaSchedules = schedules;
      }),
      graduatedScheduleTweeter.getSchedules({ year: '2020', month: '11', day: '21' }).then((schedules) => {
        allSchedules = schedules;
      }),
    ]);
  });

  it("should get the Nishino's schedules", () => {
    expect(nishinoSchedules).toEqual([
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

  it("should get the Shiraishi's schedules", () => {
    expect(shiraishiSchedules).toEqual([
      {
        type: 'TV',
        schedule: {
          date: '23:30～24:30',
          title: '全力！脱力タイムズ 新春SP',
          memberName: '白石麻衣',
        },
      },
      {
        type: 'TV',
        schedule: {
          date: '18:00〜21:00',
          title: 'ジョブチューン お正月スペシャル',
          memberName: '白石麻衣',
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

  /**
   * Because I can only get the current month's schedule,
   * this test is not scalable. Skip it.
   */
  xit("should get Wakatsuki's schedules", async () => {
    expect(wakatsukiSchedules).toEqual([
      {
        type: 'RADIO',
        schedule: {
          date: '',
          title: 'MBSラジオ 「アッパレ　やってまーす！」',
          memberName: '若月佑美',
        },
      },
    ]);
  });

  /**
   * Because I can only get the current month's schedule,
   * this test is not scalable. Skip it.
   */
  xit("should get Fukagawa's schedules", async () => {
    expect(fukagawaSchedules).toEqual([
      {
        type: 'MOVIE',
        schedule: {
          date: '',
          title: '映画「おもいで写眞」公開',
          memberName: '深川麻衣',
        },
      },
      {
        type: 'DRAMA',
        schedule: {
          date: '',
          title: 'ドラマ「福岡恋愛白書10」Twitterで配信',
          memberName: '深川麻衣',
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

  it('should sort schedules by date in an asc order', () => {});
});
