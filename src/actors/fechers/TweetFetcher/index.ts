import * as Twit from 'twit';
import { arrayToObject } from '../../../utils/array';
import { WatchingAccount } from './types';

type GetTweetResponse = Omit<Twit.PromiseResponse, 'data'> & {
  data: {
    id_str: string;
    created_at: string;
    user: {
      id_str: string;
      screen_name: string;
    };
    text: string;
  }[];
};

export type Tweet = {
  id: string;
  createdDate: Date;
  userId: string;
  userName: string;
  text: string;
};

type LastTweets = {
  [accountId: string]: {
    tweetId: string | null;
  };
};

export class TweetFetcher {
  twitter: Twit;
  watchingAccounts: WatchingAccount[];
  lastTweets: LastTweets;

  constructor({ twitter, watchingAccounts }: { twitter: Twit; watchingAccounts: WatchingAccount[] }) {
    this.twitter = twitter;
    this.watchingAccounts = watchingAccounts;
    this.lastTweets = arrayToObject(
      watchingAccounts.map((account) => ({
        id: account.id,
        tweetId: null,
      })),
      'id',
    );
  }

  public getLastTweets(): LastTweets {
    return this.lastTweets;
  }

  public async getTweets(): Promise<Tweet[]> {
    const tweets = [];

    for (const watchingAccount of this.watchingAccounts) {
      const accountTweets = await this.getTimeline(watchingAccount);
      tweets.push(...accountTweets);
    }

    return tweets;
  }

  private async getTimeline(account: WatchingAccount): Promise<Tweet[]> {
    const timeline = [];

    try {
      const response = (await this.twitter.get('statuses/user_timeline', {
        user_id: account.id,
        include_rts: false,
        count: account.count,
        since_id: this.lastTweets[account.id].tweetId ?? undefined,
      })) as GetTweetResponse;

      for (const data of response.data) {
        timeline.push({
          id: data.id_str,
          createdDate: new Date(data.created_at),
          userId: data.user.id_str,
          userName: data.user.screen_name,
          text: data.text,
        });
      }

      timeline.sort((tweetA, tweetB) => (tweetA.createdDate > tweetB.createdDate ? 1 : -1));
    } catch (error) {
      console.log('Get timeline error:', error);
    }

    return timeline;
  }

  public updateLastTweets({ account, tweetId }: { account: string; tweetId: string }): void {
    this.lastTweets[account].tweetId = tweetId;
  }
}
