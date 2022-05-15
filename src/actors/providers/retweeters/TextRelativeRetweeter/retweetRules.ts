import { containsHour, containsNogizakaNames } from '../../../../utils/string';
import { AccountId, RETWEET_ACCOUNTS_OBJECT } from './accounts';
import { TweetRelativeCallback, WatchingAccountWithCallback } from './types';

const defaultRule: TweetRelativeCallback = () => true;

const RuleMap: Record<AccountId, TweetRelativeCallback> = {
  // Nogizaka official
  [AccountId.Nogizaka46]: () => true,
  [AccountId.NogizakaKoujichu]: () => true,

  // Showroom
  [AccountId.Showroom]: (text) =>
    (text.includes('のぎおび') && containsHour(text)) ||
    (text.includes('猫舌') && containsNogizakaNames(text) && containsHour(text)) ||
    text.includes('showroom-live.com/46_') ||
    text.includes('nogizaka46'),

  // Media
  [AccountId.OriconNews]: (text) => containsNogizakaNames(text),
  [AccountId.OngakuNatalie]: (text) => containsNogizakaNames(text),
  [AccountId.LINENews]: (text) => containsNogizakaNames(text),
  [AccountId.YahooNews]: (text) => containsNogizakaNames(text),
  [AccountId.RealSound]: (text) => containsNogizakaNames(text),
  [AccountId.ModelPress]: (text) =>
    !text.includes('フォトランキング') &&
    !text.includes('このツイートをRT') &&
    !text.includes('人気記事') &&
    !text.includes('読者アンケート') &&
    !text.includes('アプリ限定') &&
    containsNogizakaNames(text),
  [AccountId.NikkanSports]: (text) => !text.includes('芸能社会ニュース') && containsNogizakaNames(text),
  [AccountId.MantanWeb]: (text) => !text.includes('今週の美女図鑑') && containsNogizakaNames(text),

  // Members
  [AccountId.IkomaRina]: () => true,
  [AccountId.KawagoHina]: (text) =>
    text.includes('お知らせ') ||
    (text.includes('動画') && (text.includes('公開') || text.includes('新作') || text.includes('更新'))) ||
    text.includes('ブログ更新'),
  [AccountId.WakatsukiYumi]: (text) => text.includes('告知'),
  [AccountId.NagashimaSeira]: (text) => text.includes('ブログ更新'),
  [AccountId.ItouNene]: (text) => text.includes('お知らせ'),
  [AccountId.HatanakaSeira]: (text) =>
    text.includes('本日の動画') || text.includes('YouTubeで生配信') || text.includes('#せいたんちゃんねる'),
  [AccountId.ShiraishiMai]: () => true,
  [AccountId.NishinoNanase]: () => true,
  [AccountId.IkutaErika]: () => true,
  [AccountId.MatsumuraSayuri]: () => true,
};

export const getWatchingAccountWithCallback = (
  accountId: AccountId,
  options?: {
    ignoreRules?: boolean;
  },
): WatchingAccountWithCallback => {
  const account = RETWEET_ACCOUNTS_OBJECT[accountId];

  if (options?.ignoreRules) {
    return { ...account, tweetRelativeCallback: defaultRule };
  }

  if (account === undefined) {
    throw new Error(`The accountId ${accountId} dose not exist accounts list.`);
  }

  return { ...account, tweetRelativeCallback: RuleMap[accountId] };
};
