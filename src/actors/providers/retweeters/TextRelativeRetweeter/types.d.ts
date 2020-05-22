import { WatchingAccount } from '../../../fechers/TweetFetcher/types';

export type TextRelativeRetweeterOptions = {
  onlySameDay: boolean | undefined;
};
export type TweetRelativeCallback = (text: string) => boolean;
export type WatchingAccountWithCallback = WatchingAccount & {
  tweetRelativeCallback: TweetRelativeCallback;
};
