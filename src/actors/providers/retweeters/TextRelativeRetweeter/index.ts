import { BaseRetweeter } from '../BaseRetweeter';
import * as Twit from 'twit';
import { WatchingAccount, Tweet } from '../../../fechers/TweetFetcher/types';
import { isSameDay } from '../../../../utils/date';
import { TweetRelativeCallback, TextRelativeRetweeterOptions } from './types';
import { getWatchingAccountWithCallback } from './retweetRules';

export class TextRelativeRetweeter extends BaseRetweeter {
  private options: TextRelativeRetweeterOptions;

  constructor({
    twitter,
    accounts,
    options,
  }: {
    twitter: Twit;
    accounts: WatchingAccount[];
    options?: TextRelativeRetweeterOptions;
  }) {
    super({ twitter, watchingAccounts: accounts });
    this.options = {
      onlySameDay: options?.onlySameDay,
    };
  }

  public async start(): Promise<void> {
    const tweetsByAccountArray = await this.tweetFetcher.getTweetsByAccount();
    const today = this.options.onlySameDay ? new Date() : undefined;

    for (const tweetsByAccount of tweetsByAccountArray) {
      const accountWithCallback = getWatchingAccountWithCallback(tweetsByAccount.accountId);

      for (const tweet of tweetsByAccount.tweets) {
        const isTweetRelative = this.isTweetRelative({
          tweet,
          today,
          tweetRelativeCallback: accountWithCallback.tweetRelativeCallback,
        });
        if (isTweetRelative) {
          await this.tweetPoster.retweet(tweet.id);
        }
        this.tweetFetcher.updateLastTweets({ accountId: tweet.userId, tweetId: tweet.id });
      }
    }
  }

  public async getRelativeTweets(): Promise<Tweet[]> {
    const tweetsByAccountArray = await this.tweetFetcher.getTweetsByAccount();
    const today = this.options?.onlySameDay ? new Date() : undefined;
    const relativeTweets = [];

    for (const tweetsByAccount of tweetsByAccountArray) {
      const accountWithCallback = getWatchingAccountWithCallback(tweetsByAccount.accountId);

      for (const tweet of tweetsByAccount.tweets) {
        const isTweetRelative = this.isTweetRelative({
          tweet,
          today,
          tweetRelativeCallback: accountWithCallback.tweetRelativeCallback,
        });
        if (isTweetRelative) {
          relativeTweets.push(tweet);
        }
      }
    }

    return relativeTweets;
  }

  private isTweetRelative({
    tweet,
    today,
    tweetRelativeCallback,
  }: {
    tweet: Tweet;
    today?: Date;
    tweetRelativeCallback: TweetRelativeCallback;
  }): boolean {
    const { text } = tweet;

    const sameDayFactor = today !== undefined ? isSameDay(today, tweet.createdDate) : true;
    const relativeTweetFactor = text !== undefined ? tweetRelativeCallback(text) : false;

    return sameDayFactor && relativeTweetFactor;
  }
}
