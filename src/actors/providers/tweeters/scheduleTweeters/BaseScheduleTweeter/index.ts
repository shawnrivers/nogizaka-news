import * as Twit from 'twit';
import { WebScraper } from '../../../../fechers/WebScraper';
import { TweetPoster } from '../../../../posters/TweetPoster';

export class BaseScheduleTweeter {
  private webScraper: WebScraper;
  protected tweetPoster: TweetPoster;

  constructor(twitter: Twit) {
    this.tweetPoster = new TweetPoster(twitter);
    this.webScraper = new WebScraper();
  }

  protected async getDOMSelector(url: string): Promise<CheerioStatic | null> {
    await this.webScraper.init(url);
    return this.webScraper.getSelector();
  }
}
