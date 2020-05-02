import * as Twit from 'twit';
import { BaseRetweeter } from '../BaseRetweeter';
import { NOGIZAKA_RELATED_ACCOUNTS } from '../../../../constants/accounts';

export class NogizakaRetweeter extends BaseRetweeter {
  constructor(twitter: Twit) {
    super({ twitter, watchingAccounts: NOGIZAKA_RELATED_ACCOUNTS });
  }

  public async start(): Promise<void> {
    const tweets = await this.tweetFetcher.getTweets();

    for (const tweet of tweets) {
      await this.tweetPoster.retweet(tweet.id);
      this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
    }
  }
}
