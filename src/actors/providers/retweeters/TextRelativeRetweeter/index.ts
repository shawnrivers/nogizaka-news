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
    const accountsTweets = await this.tweetFetcher.getTweetsByAccount();
    const today = this.options.onlySameDay ? new Date() : undefined;

    for (const accountTweets of accountsTweets) {
      const accountWithCallback = getWatchingAccountWithCallback(accountTweets.accountId);

      for (const tweet of accountTweets.tweets) {
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
    const accountsTweets = await this.tweetFetcher.getTweetsByAccount();
    const today = this.options?.onlySameDay ? new Date() : undefined;
    const informationTweets = [];

    for (const accountTweets of accountsTweets) {
      const accountWithCallback = getWatchingAccountWithCallback(accountTweets.accountId);

      for (const tweet of accountTweets.tweets) {
        const isTweetRelative = this.isTweetRelative({
          tweet,
          today,
          tweetRelativeCallback: accountWithCallback.tweetRelativeCallback,
        });
        if (isTweetRelative) {
          informationTweets.push(tweet);
        }
      }
    }

    return informationTweets;
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
