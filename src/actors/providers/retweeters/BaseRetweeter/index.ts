import * as Twit from 'twit';
import { TweetFetcher } from '../../../fechers/TweetFetcher';
import { TweetPoster } from '../../../posters/TweetPoster';
import { WatchingAccount } from '../../../fechers/TweetFetcher/types';

export class BaseRetweeter {
  protected tweetFetcher: TweetFetcher;
  protected tweetPoster: TweetPoster;

  constructor({ twitter, watchingAccounts }: { twitter: Twit; watchingAccounts: WatchingAccount[] }) {
    this.tweetFetcher = new TweetFetcher({ twitter, watchingAccounts });
    this.tweetPoster = new TweetPoster(twitter);
  }
}
