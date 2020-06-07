import { ScheduleWithType } from '../types';
import { getTweetableSchedulesWithType } from '../converters';

describe('getTweetableSchedulesWithType', () => {
  const heading = '4月6日のスケジュール';

  test('Show empty schedules in a heading + "なし" format', () => {
    const emptySchedules: ScheduleWithType[] = [
      { type: 'LIVE/EVENT', schedule: [] },
      { type: '握手会', schedule: [] },
      { type: 'TV', schedule: [] },
      { type: 'RADIO', schedule: [] },
      { type: 'MAGAZINE', schedule: [] },
      { type: 'WEB', schedule: [] },
      { type: 'MOVIE', schedule: [] },
      { type: 'THEATRE', schedule: [] },
      { type: 'RELEASE', schedule: [] },
      { type: '誕生日', schedule: [] },
    ];

    expect(getTweetableSchedulesWithType({ schedules: emptySchedules, heading })).toEqual(
      // prettier-ignore
      [
`4月6日のスケジュール

なし`,
      ],
    );
  });

  test('Keep schedules with less than 275 characters in one item in an array', () => {
    const shortSchedules: ScheduleWithType[] = [
      { type: 'LIVE/EVENT', schedule: [] },
      {
        type: '握手会',
        schedule: [],
      },
      {
        type: 'TV',
        schedule: ['10:00～10:30 NHK Eテレ「将棋フォーカス」向井葉月', '24:00～24:30 テレビ東京系「乃木坂工事中」'],
      },
      {
        type: 'RADIO',
        schedule: [
          '18:00～18:30 文化放送「乃木坂46の『の』」岩本蓮加、中田花奈',
          '20:05～22:55 NHKラジオ第1「らじらー！サンデー」',
        ],
      },
      { type: 'MAGAZINE', schedule: [] },
      { type: 'WEB', schedule: [] },
      { type: 'MOVIE', schedule: [] },
      { type: 'THEATRE', schedule: [] },
      { type: 'RELEASE', schedule: [] },
      { type: '誕生日', schedule: [] },
    ];

    expect(getTweetableSchedulesWithType({ schedules: shortSchedules, heading })).toEqual(
      // prettier-ignore
      [
`4月6日のスケジュール

【TV】
1. 10:00～10:30 NHK Eテレ「将棋フォーカス」向井葉月
2. 24:00～24:30 テレビ東京系「乃木坂工事中」

【RADIO】
1. 18:00～18:30 文化放送「乃木坂46の『の』」岩本蓮加、中田花奈
2. 20:05～22:55 NHKラジオ第1「らじらー！サンデー」`,
      ],
    );
  });

  test('Separate schedules with more than 275 characters into multiple items in an array', () => {
    const longSchedules: ScheduleWithType[] = [
      { type: 'LIVE/EVENT', schedule: [] },
      {
        type: '握手会',
        schedule: [],
      },
      {
        type: 'TV',
        schedule: [
          '10:00～10:30 NHK Eテレ「将棋フォーカス」向井葉月',
          '24:00～24:30 テレビ東京系「乃木坂工事中」',
          '24:30〜25:30 TBSチャンネル1「かなりんのトップ目とれるカナ?」中田花奈',
        ],
      },
      {
        type: 'RADIO',
        schedule: [
          '18:00～18:30 文化放送「乃木坂46の『の』」岩本蓮加、中田花奈',
          '20:05～22:55 NHKラジオ第1「らじらー！サンデー」',
        ],
      },
      { type: 'MAGAZINE', schedule: [] },
      { type: 'WEB', schedule: [] },
      { type: 'MOVIE', schedule: [] },
      { type: 'THEATRE', schedule: [] },
      { type: 'RELEASE', schedule: [] },
      { type: '誕生日', schedule: [] },
    ];

    expect(getTweetableSchedulesWithType({ schedules: longSchedules, heading })).toEqual(
      // prettier-ignore
      [
`4月6日のスケジュール

【TV】
1. 10:00～10:30 NHK Eテレ「将棋フォーカス」向井葉月
2. 24:00～24:30 テレビ東京系「乃木坂工事中」
3. 24:30〜25:30 TBSチャンネル1「かなりんのトップ目とれるカナ?」中田花奈

【RADIO】
1. 18:00～18:30 文化放送「乃木坂46の『の』」岩本蓮加、中田花奈`,

`4月6日のスケジュー（2）

【RADIO】
2. 20:05～22:55 NHKラジオ第1「らじらー！サンデー」`,
      ],
    );
  });
});
