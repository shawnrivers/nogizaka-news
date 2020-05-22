import { BaseRetweeter } from '../BaseRetweeter';
import * as Twit from 'twit';
import { WatchingAccount, Tweet } from '../../../fechers/TweetFetcher/types';
import { isSameDay } from '../../../../utils/date';
import { TweetRelativeCallback } from './types';
import { getWatchingAccountWithCallback } from './retweetRules';

export class TextRelativeRetweeter extends BaseRetweeter {
  constructor({ twitter, accounts }: { twitter: Twit; accounts: WatchingAccount[] }) {
    super({ twitter, watchingAccounts: accounts });
  }

  public async start(): Promise<void> {
    const accountsTweets = await this.tweetFetcher.getTweetsByAccount();
    const today = new Date();

    for (const accountTweets of accountsTweets) {
      const accountWithCallback = getWatchingAccountWithCallback(accountTweets.accountId);

      for (const tweet of accountTweets.tweets) {
        if (this.isTweetRelative({ tweet, today, tweetRelativeCallback: accountWithCallback.tweetRelativeCallback })) {
          await this.tweetPoster.retweet(tweet.id);
        }
        this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
      }
    }
  }

  public async getRelativeTweets({ sameDay }: { sameDay: boolean }): Promise<Tweet[]> {
    const accountsTweets = await this.tweetFetcher.getTweetsByAccount();
    const today = sameDay ? new Date() : undefined;
    const informationTweets = [];

    for (const accountTweets of accountsTweets) {
      const accountWithCallback = getWatchingAccountWithCallback(accountTweets.accountId);

      for (const tweet of accountTweets.tweets) {
        if (this.isTweetRelative({ tweet, today, tweetRelativeCallback: accountWithCallback.tweetRelativeCallback })) {
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
