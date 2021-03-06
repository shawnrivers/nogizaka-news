import * as Twit from 'twit';

type PostTweetResponse = Omit<Twit.PromiseResponse, 'data'> & {
  data: { id_str: string };
};

export class TweetPoster {
  private twitter: Twit;

  constructor(twitter: Twit) {
    this.twitter = twitter;
  }

  public async retweet(tweetId: string): Promise<Twit.PromiseResponse | undefined> {
    try {
      const response = await this.twitter.post('statuses/retweet/:id', { id: tweetId });
      console.log('[Retweet] Succeeded:', tweetId);
      return response;
    } catch (error) {
      console.log('[Retweet] Failed:', error.message);
    }
  }

  public async tweet(tweet: string): Promise<Twit.PromiseResponse | undefined> {
    try {
      const response = await this.twitter.post('statuses/update', { status: tweet });
      console.log('Tweet succeeded:', tweet);
      return response;
    } catch (error) {
      console.log('Tweet failed:', error.message);
    }
  }

  public async tweetThread(tweets: string[]): Promise<void> {
    let threadID = null;

    try {
      for (const tweet of tweets) {
        const response = (await this.twitter.post('statuses/update', {
          status: tweet,
          in_reply_to_status_id: threadID ?? undefined,
        })) as PostTweetResponse;

        threadID = response.data.id_str;
      }
    } catch (error) {
      console.log('Tweet thread failed:', error.message);
    }
  }
}
