import { NogizakaScheduleTweeter } from '..';
import { MemberScheduleWithType, ScheduleWithType } from '../../BaseScheduleTweeter/types';

/**
 * CI doesn't have the tokens to make Twitter requests, so skip it.
 * Run it on local environment.
 */
describe('NogizakaScheduleTweeter', () => {
  let nogizakaScheduleTweeter: NogizakaScheduleTweeter;

  let schedules: ScheduleWithType[] = [];

  beforeAll(async () => {
    const Twitter = await import('../../../../../../utils/twit');
    nogizakaScheduleTweeter = new NogizakaScheduleTweeter(Twitter as any);

    schedules = await nogizakaScheduleTweeter.getSchedules({ year: '2022', month: '02', day: '02' });
  });

  it('should get the correct schedules', () => {
    expect(schedules).toEqual([
      { type: 'ライブ/イベント', schedule: [] },
      { type: '握手会', schedule: [] },
      {
        type: 'TV',
        schedule: ['22:57〜23:00 MBS「水曜日のハウマッチ？」鈴木絢音'],
      },
      {
        type: 'ラジオ',
        schedule: [
          '13:00〜14:55 TOKYO FM「山崎怜奈の誰かに話したかったこと。」山崎怜奈',
          '22:00〜25:00 文化放送「レコメン！」早川聖来',
          '25:00〜27:00 ニッポン放送「乃木坂46のオールナイトニッポン」新内眞衣、秋元真夏',
        ],
      },
      {
        type: '書籍',
        schedule: ['「TV LIFE」吉田綾乃クリスティー'],
      },
      {
        type: 'WEB',
        schedule: [
          '「PEACH JOHN」山下美月',
          '18:00〜18:30 SHOWROOM「のぎおび」伊藤理々杏',
          '19:00〜21:00 SHOWROOM「猫舌SHOWROOM」黒見明香、佐藤璃果',
        ],
      },
      { type: '映画', schedule: [] },
      { type: '舞台/ミュージカル', schedule: [] },
      { type: 'リリース', schedule: [] },
      {
        type: '誕生日',
        schedule: ['岩本 蓮加'],
      },
    ]);
  });
});
