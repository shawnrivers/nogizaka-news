import { IWatchedAccount } from './types';

export const newsMediaAccounts: IWatchedAccount[] = [
  { id: '142921471', count: 30 }, // モデルプレス
  { id: '24172196', count: 30 }, // MANTANWEB
  { id: '95207674', count: 30 }, // ORICON NEWS
  { id: '5649672', count: 30 }, // 音楽ナタリー
  { id: '1516060316', count: 30 }, // LINE NEWS
  { id: '46058599', count: 30 }, // 日刊スポーツ
];

export const nogizakaRelatedAccounts: IWatchedAccount[] = [
  { id: '317684165', count: 10 }, // 乃木坂46
  { id: '929625878249684992', count: 1 }, // 乃木坂工事中
  { id: '1001065920234573824', count: 1 }, // 乃木坂46新聞
];


export const NOGIZAKA_NAMES = [
  '乃木坂46',
  'nogizaka46',
  '衛藤美彩',
  '川後陽菜',
  '西野七瀬',
  '若月佑美',
  '能條愛未',
  '生駒里奈',
  '川村真洋',
  '斎藤ちはる',
  '相楽伊織',
  '伊藤万理華',
  '中元日芽香',
  '橋本奈々未',
  '深川麻衣',
  '永島聖羅',
  '松井玲奈',
  '畠中清羅',
  '大和里菜',
  '伊藤寧々',
  '市來玲奈',
  '宮沢セイラ',
  '宮澤成良',
  '柏幸奈',
  '安藤美雲',
  '岩瀬佑美子',
];

export enum ScheduleType {
  Live = 'live',
  Handshake = 'handshake',
  Tv = 'tv',
  Radio = 'radio',
  Magazine = 'magazine',
  Web = 'web',
  Moive = 'movie',
  Theatre = 'theatre',
  Release = 'release',
  Birthday = 'birthday',
}

export const scheduleTypes = [
  { type: ScheduleType.Live, className: '.live', displayName: 'LIVE/EVENT' },
  { type: ScheduleType.Handshake, className: '.handshake', displayName: '握手会' },
  { type: ScheduleType.Tv, className: '.tv', displayName: 'TV' },
  { type: ScheduleType.Radio, className: '.radio', displayName: 'RADIO' },
  { type: ScheduleType.Magazine, className: '.magazine', displayName: 'MAGZINE' },
  { type: ScheduleType.Web, className: '.web', displayName: 'WEB' },
  { type: ScheduleType.Moive, className: '.movie', displayName: 'MOVIE' },
  { type: ScheduleType.Theatre, className: '.theatre', displayName: 'THEATRE' },
  { type: ScheduleType.Release, className: '.release', displayName: 'REALSE' },
  { type: ScheduleType.Birthday, className: '.bd', displayName: '誕生日' },
];
