import * as Twit from 'twit';
import { WAKATSUKI_ACCOUNT } from '../../../../constants/accounts';
import { Tweet } from '../../../fechers/TweetFetcher/types';
import { BaseRetweeter } from '../BaseRetweeter';
import { isSameDay } from '../../../../utils/date';

export class WakatsukiRetweeter extends BaseRetweeter {
  constructor(twitter: Twit) {
    super({ twitter, watchingAccounts: [WAKATSUKI_ACCOUNT] });
  }

  public async start(): Promise<void> {
    const tweets = await this.tweetFetcher.getTweets();
    const today = new Date();

    for (const tweet of tweets) {
      if (this.isInformation(tweet, today)) {
        await this.tweetPoster.retweet(tweet.id);
      }
      this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
    }
  }

  private isInformation(tweet: Tweet, today?: Date): boolean {
    const { text, createdDate } = tweet;

    if (text !== undefined) {
      if (text.includes('告知') && (today !== undefined ? isSameDay(today, createdDate) : true)) {
        return true;
      }
    }

    return false;
  }

  public async getInformationTweets({ sameDay }: { sameDay: boolean }): Promise<Tweet[]> {
    const tweets = await this.tweetFetcher.getTweets();
    const today = new Date();
    const informationTweets = [];

    for (const tweet of tweets) {
      if (this.isInformation(tweet, sameDay ? today : undefined)) {
        informationTweets.push(tweet);
      }
    }

    return informationTweets;
  }
}
