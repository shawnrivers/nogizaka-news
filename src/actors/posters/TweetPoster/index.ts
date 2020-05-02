import * as Twit from 'twit';

type PostTweetResponse = Omit<Twit.PromiseResponse, 'data'> & {
  data: { id_str: string };
};

export class TweetPoster {
  twitter: Twit;

  constructor(twitter: Twit) {
    this.twitter = twitter;
  }

  public async retweet(tweetId: string): Promise<Twit.PromiseResponse | unknown> {
    try {
      const response = await this.twitter.post('statuses/retweet/:id', { id: tweetId });
      console.log('Retweet succeeded:', tweetId);
      return response;
    } catch (error) {
      console.log('Retweet failed:', error.message);
      return error;
    }
  }

  public async tweet(tweet: string): Promise<Twit.PromiseResponse | unknown> {
    try {
      const response = await this.twitter.post('statuses/update', { status: tweet });
      console.log('Tweet succeeded:', tweet);
      return response;
    } catch (error) {
      console.log('Tweet failed:', error.message);
      return error;
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
