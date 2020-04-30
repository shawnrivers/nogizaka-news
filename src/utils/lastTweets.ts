import { NEWS_MEDIA_ACCOUNTS, NOGIZAKA_RELATED_ACCOUNTS, SHOWROOM_ACCOUNT } from './constants';

export const getInitialLastTweets = () => {
  const lastTweets: any = {};
  const accounts = [SHOWROOM_ACCOUNT, ...NOGIZAKA_RELATED_ACCOUNTS, ...NEWS_MEDIA_ACCOUNTS];

  for (const account of accounts) {
    lastTweets[account.id] = '';
  }

  return lastTweets;
};
