import { WatchingAccount } from '../actors/fechers/TweetFetcher/types';

export enum AccountId {
  ModelPress = '142921471',
  MantanWeb = '24172196',
  OriconNews = '95207674',
  OngakuNatalie = '5649672',
  LINENews = '1516060316',
  NikkanSports = '46058599',
  YahooNews = '88846085',
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
  { id: AccountId.ModelPress, count: 30 }, // モデルプレス
  { id: AccountId.MantanWeb, count: 30 }, // MANTANWEB
  { id: AccountId.OriconNews, count: 30 }, // ORICON NEWS
  { id: AccountId.OngakuNatalie, count: 30 }, // 音楽ナタリー
  { id: AccountId.LINENews, count: 30 }, // LINE NEWS
  { id: AccountId.NikkanSports, count: 30 }, // 日刊スポーツ
  { id: AccountId.YahooNews, count: 30 }, // Yahoo!ニュース
];

export const NOGIZAKA_RELATED_ACCOUNTS: WatchingAccount[] = [
  { id: AccountId.Nogizaka46, count: 10 }, // 乃木坂46
  { id: AccountId.NogizakaKoujichu, count: 1 }, // 乃木坂工事中
];

export const SHOWROOM_ACCOUNT: WatchingAccount = { id: AccountId.Showroom, count: 30 };

export const IKOMA_ACCOUNT: WatchingAccount = { id: AccountId.IkomaRina, count: 5 };
export const WAKATSUKI_ACCOUNT: WatchingAccount = { id: AccountId.WakatsukiYumi, count: 5 };
export const KAWAGO_ACCOUNT: WatchingAccount = { id: AccountId.KawagoHina, count: 5 };
