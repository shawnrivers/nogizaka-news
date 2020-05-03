import * as Twit from 'twit';
import { BaseRetweeter } from '../BaseRetweeter';
import { NOGIZAKA_NAMES } from '../../../../constants/names';
import { NEWS_MEDIA_ACCOUNTS, AccountId } from '../../../../constants/accounts';
import { Tweet } from '../../../fechers/TweetFetcher/types';

export class MediaRetweeter extends BaseRetweeter {
  constructor(twitter: Twit) {
    super({ twitter, watchingAccounts: NEWS_MEDIA_ACCOUNTS });
  }

  public async start(): Promise<void> {
    const tweets = await this.tweetFetcher.getTweets();

    for (const tweet of tweets) {
      if (this.relatesToNogizaka(tweet)) {
        await this.tweetPoster.retweet(tweet.id);
      }
      this.tweetFetcher.updateLastTweets({ account: tweet.userId, tweetId: tweet.id });
    }
  }

  private relatesToNogizaka(tweet: Tweet): boolean {
    const { text, userId } = tweet;

    if (text === undefined) {
      return false;
    }

    for (const name of NOGIZAKA_NAMES) {
      if (text.includes(name)) {
        switch (userId) {
          case AccountId.ModelPress:
            return (
              !text.includes('フォトランキング') && !text.includes('このツイートをRT') && !text.includes('人気記事')
            );
          case AccountId.NikkanSports:
            return !text.includes('芸能社会ニュース');
          case AccountId.MantanWeb:
            return !text.includes('今週の美女図鑑');
          default:
            return true;
        }
      }
    }

    return false;
  }
}
