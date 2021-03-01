import { containsHour, containsNogizakaNames } from '../../../../utils/string';
import { AccountId, RETWEET_ACCOUNTS_OBJECT } from './accounts';
import { TweetRelativeCallback, WatchingAccountWithCallback } from './types';

const defaultRule: TweetRelativeCallback = () => false;

// Group official accounts rules
const nogizakaRule: TweetRelativeCallback = () => true;

// Member rules
const ikomaRule: TweetRelativeCallback = (text) => text.includes('出演情報');
const kawagoRule: TweetRelativeCallback = (text) =>
  text.includes('お知らせ') ||
  (text.includes('動画') && (text.includes('公開') || text.includes('新作') || text.includes('更新'))) ||
  text.includes('ブログ更新');
const wakatsukiRule: TweetRelativeCallback = (text) => text.includes('告知');
const nagashimaRule: TweetRelativeCallback = (text) => text.includes('ブログ更新');
const neneRule: TweetRelativeCallback = (text) => text.includes('お知らせ');
const hatanakaRule: TweetRelativeCallback = (text) =>
  text.includes('本日の動画') || text.includes('YouTubeで生配信') || text.includes('#せいたんちゃんねる');
const shiraishiRule: TweetRelativeCallback = () => true;
const nishinoRule: TweetRelativeCallback = () => true;

// Media rules
const showroomRule: TweetRelativeCallback = (text) =>
  (text.includes('のぎおび') && containsHour(text)) ||
  (text.includes('猫舌') && containsNogizakaNames(text) && containsHour(text)) ||
  text.includes('showroom-live.com/46_') ||
  text.includes('nogizaka46');
const newsRule: TweetRelativeCallback = containsNogizakaNames;
const modelPressRule: TweetRelativeCallback = (text) =>
  !text.includes('フォトランキング') &&
  !text.includes('このツイートをRT') &&
  !text.includes('人気記事') &&
  !text.includes('読者アンケート') &&
  !text.includes('アプリ限定') &&
  newsRule(text);
const nikkanSportsRule: TweetRelativeCallback = (text) => !text.includes('芸能社会ニュース') && newsRule(text);
const mantanWebRule: TweetRelativeCallback = (text) => !text.includes('今週の美女図鑑') && newsRule(text);

export const getWatchingAccountWithCallback = (
  accountId: AccountId,
  options?: {
    ignoreRules?: boolean;
  },
): WatchingAccountWithCallback => {
  const account = RETWEET_ACCOUNTS_OBJECT[accountId];

  if (options?.ignoreRules) {
    return { ...account, tweetRelativeCallback: nogizakaRule };
  }

  if (account === undefined) {
    throw new Error(`The accountId ${accountId} dose not exist accounts list.`);
  }

  if (account.type === 'nogizaka') {
    return { ...account, tweetRelativeCallback: nogizakaRule };
  }

  if (account.type === 'media') {
    if (accountId === AccountId.Showroom) {
      return { ...account, tweetRelativeCallback: showroomRule };
    }

    if (accountId === AccountId.ModelPress) {
      return { ...account, tweetRelativeCallback: modelPressRule };
    }

    if (accountId === AccountId.NikkanSports) {
      return { ...account, tweetRelativeCallback: nikkanSportsRule };
    }

    if (accountId === AccountId.MantanWeb) {
      return { ...account, tweetRelativeCallback: mantanWebRule };
    }

    return { ...account, tweetRelativeCallback: newsRule };
  }

  if (account.type === 'member') {
    if (accountId === AccountId.IkomaRina) {
      return { ...account, tweetRelativeCallback: ikomaRule };
    }

    if (accountId === AccountId.WakatsukiYumi) {
      return { ...account, tweetRelativeCallback: wakatsukiRule };
    }

    if (accountId === AccountId.KawagoHina) {
      return { ...account, tweetRelativeCallback: kawagoRule };
    }

    if (accountId === AccountId.NagashimaSeira) {
      return { ...account, tweetRelativeCallback: nagashimaRule };
    }

    if (accountId === AccountId.ItouNene) {
      return { ...account, tweetRelativeCallback: neneRule };
    }

    if (accountId === AccountId.HatanakaSeira) {
      return { ...account, tweetRelativeCallback: hatanakaRule };
    }

    if (accountId === AccountId.ShiraishiMai) {
      return { ...account, tweetRelativeCallback: shiraishiRule };
    }

    if (accountId === AccountId.NishinoNanase) {
      return { ...account, tweetRelativeCallback: nishinoRule };
    }
  }

  return { ...account, tweetRelativeCallback: defaultRule };
};
