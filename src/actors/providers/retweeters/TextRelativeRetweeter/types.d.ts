import { WatchingAccount } from '../../../fechers/TweetFetcher/types';

export type TweetRelativeCallback = (text: string) => boolean;
export type WatchingAccountWithCallback = WatchingAccount & {
  tweetRelativeCallback: TweetRelativeCallback;
};
