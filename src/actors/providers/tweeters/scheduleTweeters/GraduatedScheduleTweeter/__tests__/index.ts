import { GraduatedScheduleTweeter } from '..';
import { MemberScheduleWithType, ScheduleWithType } from '../../BaseScheduleTweeter/types';

/**
 * CI doesn't have the tokens to make Twitter requests, so skip it.
 * Run it on local environment.
 */
xdescribe('GraduatedScheduleTweeter', () => {
  let graduatedScheduleTweeter: GraduatedScheduleTweeter;

  let nishinoSchedules: MemberScheduleWithType[] = [];
  let shiraishiSchedules: MemberScheduleWithType[] = [];
  let marikaSchedules: MemberScheduleWithType[] = [];
  let ikomaSchedules: MemberScheduleWithType[] = [];
  let wakatsukiSchedules: MemberScheduleWithType[] = [];
  let fukagawaSchedules: MemberScheduleWithType[] = [];
  let mionaSchedules: MemberScheduleWithType[] = [];
  let sakuraiSchedules: MemberScheduleWithType[] = [];
  let matsumuraSchedules: MemberScheduleWithType[] = [];
  let mahiroSchedules: MemberScheduleWithType[] = [];

  let allSchedules: ScheduleWithType[] = [];

  beforeAll(async () => {
    const Twitter = await import('../../../../../../utils/twit');
    graduatedScheduleTweeter = new GraduatedScheduleTweeter(Twitter as any);

    return Promise.all([
      graduatedScheduleTweeter.getNishinoSchedules({ year: '2020', month: '12', day: '22' }).then((schedules) => {
        nishinoSchedules = schedules;
      }),
      graduatedScheduleTweeter.getShiraishiSchedules({ year: '2021', month: '01', day: '01' }).then((schedules) => {
        shiraishiSchedules = schedules;
      }),
      graduatedScheduleTweeter.getMarikaSchedules({ year: '2021', month: '05', day: '19' }).then((schedules) => {
        marikaSchedules = schedules;
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
      graduatedScheduleTweeter.getMionaSchedules({ year: '2021', month: '06', day: '09' }).then((schedules) => {
        mionaSchedules = schedules;
      }),
      graduatedScheduleTweeter.getSakuraiSchedules({ year: '2021', month: '09', day: '28' }).then((schedules) => {
        sakuraiSchedules = schedules;
      }),
      graduatedScheduleTweeter.getMatsumuraSchedules({ year: '2021', month: '07', day: '13' }).then((schedules) => {
        matsumuraSchedules = schedules;
      }),
      graduatedScheduleTweeter.getMahiroSchedules({ year: '2021', month: '07', day: '23' }).then((schedules) => {
        mahiroSchedules = schedules;
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

  it("should get the Marika's schedules", () => {
    expect(marikaSchedules).toEqual([
      {
        type: 'STAGE',
        schedule: {
          date: '',
          title: 'M&Oplaysプロデュース「DOORS」@世田谷パブリックシアター',
          memberName: '伊藤万理華',
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

  it("should get Miona's schedules", async () => {
    expect(mionaSchedules).toEqual([
      {
        type: 'TV',
        schedule: {
          date: '',
          title: 'テレビ朝日「あいつ今何してる？」にゲスト出演！',
          memberName: '堀未央奈',
        },
      },
      {
        type: 'TV',
        schedule: {
          date: '',
          title: 'テレビ朝日「声優パーク建設計画 VR部」に生出演！',
          memberName: '堀未央奈',
        },
      },
    ]);
  });

  it("should get Sakurai's schedules", async () => {
    expect(sakuraiSchedules).toEqual([
      {
        type: 'STAGE',
        schedule: {
          date: '',
          title: 'ロック☆オペラ『ザ・パンデモニアム・ロック・ショー〜The Pandemonium Rock Show〜』',
          memberName: '桜井玲香',
        },
      },
      {
        type: 'MAGAZINE',
        schedule: {
          date: '',
          title: '「CLASSY.」',
          memberName: '桜井玲香',
        },
      },
    ]);
  });

  it("should get Sayuringo's schedules", async () => {
    expect(matsumuraSchedules).toEqual([
      {
        type: 'MAGAZINE',
        schedule: {
          date: '',
          title: '「松村沙友理 乃木坂46卒業記念写真集『次、いつ会える？』」',
          memberName: '松村沙友理',
        },
      },
      {
        type: 'TV',
        schedule: {
          date: '22:00～23:12',
          title: 'TBS系「火曜ドラマ『プロミス・シンデレラ』」',
          memberName: '松村沙友理',
        },
      },
      {
        type: 'WEB',
        schedule: {
          date: '',
          title: '「ORICON NEWS」',
          memberName: '松村沙友理',
        },
      },
      {
        type: 'WEB',
        schedule: {
          date: '',
          title: '「cancam.jp」',
          memberName: '松村沙友理',
        },
      },
      {
        type: 'WEB',
        schedule: {
          date: '',
          title: '「モデルプレス」',
          memberName: '松村沙友理',
        },
      },
      {
        type: 'RADIO',
        schedule: {
          date: '25:00～26:00',
          title: 'MBSラジオ「イマドキッ」',
          memberName: '松村沙友理',
        },
      },
    ]);
  });

  it("should get Mahiro's schedules", async () => {
    expect(mahiroSchedules).toEqual([
      {
        type: 'LIVE',
        schedule: {
          date: '',
          title: '18:30〜 配信LIVE「真洋(mahiro) Birthday Party」',
          memberName: '川村真洋',
        },
      },
      {
        type: 'RELEASE',
        schedule: {
          date: '',
          title: '1st Single「GDBD」配信Release',
          memberName: '川村真洋',
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
        type: 'RELEASE',
        schedule: [],
      },
      {
        type: 'LIVE',
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
