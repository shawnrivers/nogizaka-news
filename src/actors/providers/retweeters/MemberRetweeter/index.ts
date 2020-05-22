import { BaseRetweeter } from '../BaseRetweeter';
import * as Twit from 'twit';
import { WatchingAccount, Tweet } from '../../../fechers/TweetFetcher/types';
import { isSameDay } from '../../../../utils/date';
import { TweetRelativeCallback } from './types';

export class MemberRetweeter extends BaseRetweeter {
  private tweetRelativeCallback: TweetRelativeCallback;

  constructor({
    twitter,
    account,
    tweetRelativeCallback,
  }: {
    twitter: Twit;
    account: WatchingAccount;
    tweetRelativeCallback: TweetRelativeCallback;
  }) {
    super({ twitter, watchingAccounts: [account] });
    this.tweetRelativeCallback = tweetRelativeCallback;
  }

  public async start(): Promise<void> {
    const tweets = await this.tweetFetcher.getTweets();
    const today = new Date();

    for (const tweet of tweets) {
      if (this.isTweetRelative({ tweet, today })) {
        await this.tweetPoster.retweet(tweet.id);
      }
      this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
    }
  }

  private isTweetRelative({ tweet, today }: { tweet: Tweet; today?: Date }): boolean {
    const { text } = tweet;

    const sameDayFactor = today !== undefined ? isSameDay(today, tweet.createdDate) : true;

    const relativeTweetFactor = text !== undefined ? this.tweetRelativeCallback(text) : false;

    return sameDayFactor && relativeTweetFactor;
  }

  public async getRelativeTweets({ sameDay }: { sameDay: boolean }): Promise<Tweet[]> {
    const tweets = await this.tweetFetcher.getTweets();
    const today = new Date();
    const informationTweets = [];

    for (const tweet of tweets) {
      if (this.isTweetRelative({ tweet, today: sameDay ? today : undefined })) {
        informationTweets.push(tweet);
      }
    }

    return informationTweets;
  }
}
