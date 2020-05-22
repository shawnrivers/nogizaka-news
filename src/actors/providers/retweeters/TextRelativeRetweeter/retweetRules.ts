import { AccountId, RETWEET_ACCOUNTS_OBJECT } from '../../../../constants/accounts';
import { TweetRelativeCallback, WatchingAccountWithCallback } from './types';
import { containsHour } from '../../../../utils/string';
import { NOGIZAKA_NAMES } from '../../../../constants/names';

const defaultRule: TweetRelativeCallback = () => true;
const ikomaRule: TweetRelativeCallback = (text) => text.includes('出演情報');
const kawagoRule: TweetRelativeCallback = (text) => text.includes('お知らせ');
const wakatsukiRule: TweetRelativeCallback = (text) => text.includes('告知');
const showroomScheduleRule: TweetRelativeCallback = (text) => text.includes('のぎおび') && containsHour(text);
const newsMediaRule: TweetRelativeCallback = (text) => {
  for (const name of NOGIZAKA_NAMES) {
    if (text.includes(name)) {
      return true;
    }
  }

  return false;
};
const modelPressRule: TweetRelativeCallback = (text) =>
  !text.includes('フォトランキング') &&
  !text.includes('このツイートをRT') &&
  !text.includes('人気記事') &&
  newsMediaRule(text);
const nikkanSportsRule: TweetRelativeCallback = (text) => !text.includes('芸能社会ニュース') && newsMediaRule(text);
const mantanWebRule: TweetRelativeCallback = (text) => !text.includes('今週の美女図鑑') && newsMediaRule(text);

export const getWatchingAccountWithCallback = (accountId: AccountId): WatchingAccountWithCallback => {
  const account = RETWEET_ACCOUNTS_OBJECT[accountId];

  if (accountId === AccountId.IkomaRina) {
    return { ...account, tweetRelativeCallback: ikomaRule };
  }

  if (accountId === AccountId.WakatsukiYumi) {
    return { ...account, tweetRelativeCallback: wakatsukiRule };
  }

  if (accountId === AccountId.KawagoHina) {
    return { ...account, tweetRelativeCallback: kawagoRule };
  }

  if (accountId === AccountId.Showroom) {
    return { ...account, tweetRelativeCallback: showroomScheduleRule };
  }

  if (account.type === 'news') {
    if (accountId === AccountId.ModelPress) {
      return { ...account, tweetRelativeCallback: modelPressRule };
    }

    if (accountId === AccountId.NikkanSports) {
      return { ...account, tweetRelativeCallback: nikkanSportsRule };
    }

    if (accountId === AccountId.MantanWeb) {
      return { ...account, tweetRelativeCallback: mantanWebRule };
    }

    return { ...account, tweetRelativeCallback: newsMediaRule };
  }

  return { ...account, tweetRelativeCallback: defaultRule };
};
