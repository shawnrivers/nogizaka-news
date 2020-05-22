import { WatchingAccount } from '../actors/fechers/TweetFetcher/types';
import { arrayToObject } from '../utils/array';

export enum AccountId {
  ModelPress = '142921471',
  MantanWeb = '24172196',
  OriconNews = '95207674',
  OngakuNatalie = '5649672',
  LINENews = '1516060316',
  NikkanSports = '46058599',
  YahooNews = '88846085',
  RealSound = '1501970341',
  Nogizaka46 = '317684165',
  NogizakaKoujichu = '929625878249684992',
  Showroom = '2212674829',
  KawagoHina = '1091388477088780288',
  IkomaRina = '1237442080730787840',
  WakatsukiYumi = '1253595964444520448',
  NagashimaSeira = '730678731862212609',
  HatanakaSeira = '4077236000',
  ItouNene = '3190643234',
}

export const NEWS_MEDIA_ACCOUNTS: WatchingAccount[] = [
  { id: AccountId.ModelPress, count: 30, type: 'news' }, // モデルプレス
  { id: AccountId.MantanWeb, count: 30, type: 'news' }, // MANTANWEB
  { id: AccountId.OriconNews, count: 30, type: 'news' }, // ORICON NEWS
  { id: AccountId.OngakuNatalie, count: 30, type: 'news' }, // 音楽ナタリー
  { id: AccountId.LINENews, count: 30, type: 'news' }, // LINE NEWS
  { id: AccountId.NikkanSports, count: 30, type: 'news' }, // 日刊スポーツ
  { id: AccountId.YahooNews, count: 30, type: 'news' }, // Yahoo!ニュース
  { id: AccountId.RealSound, count: 30, type: 'news' }, // Real Sound
];

export const NOGIZAKA_ACCOUNTS: WatchingAccount[] = [
  { id: AccountId.Nogizaka46, count: 10, type: 'nogizaka' }, // 乃木坂46
  { id: AccountId.NogizakaKoujichu, count: 1, type: 'nogizaka' }, // 乃木坂工事中
];

export const SHOWROOM_ACCOUNT: WatchingAccount = { id: AccountId.Showroom, count: 30, type: 'showroom' };

export const IKOMA_ACCOUNT: WatchingAccount = { id: AccountId.IkomaRina, count: 5, type: 'member' };
export const WAKATSUKI_ACCOUNT: WatchingAccount = { id: AccountId.WakatsukiYumi, count: 5, type: 'member' };
export const KAWAGO_ACCOUNT: WatchingAccount = { id: AccountId.KawagoHina, count: 5, type: 'member' };

export const RETWEET_ACCOUNTS_OBJECT = arrayToObject(
  [...NOGIZAKA_ACCOUNTS, ...NEWS_MEDIA_ACCOUNTS, SHOWROOM_ACCOUNT, IKOMA_ACCOUNT, WAKATSUKI_ACCOUNT, KAWAGO_ACCOUNT],
  'id',
);
