import * as Twit from 'twit';
import { BaseRetweeter } from '../BaseRetweeter';
import { containsHour } from '../../../../utils/string';
import { SHOWROOM_ACCOUNT } from '../../../../constants/accounts';

export class ShowroomRetweeter extends BaseRetweeter {
  constructor(twitter: Twit) {
    super({ twitter, watchingAccounts: [SHOWROOM_ACCOUNT] });
  }

  public async start(): Promise<void> {
    const tweets = await this.tweetFetcher.getTweets();

    for (const tweet of tweets) {
      if (this.containsShowroomSchedule(tweet.text)) {
        await this.tweetPoster.retweet(tweet.id);
      }
      this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
    }
  }

  private containsShowroomSchedule(tweetText: string): boolean {
    if (tweetText === undefined) {
      return false;
    }

    if (tweetText.includes('のぎおび') && containsHour(tweetText)) {
      return true;
    }

    return false;
  }
}
