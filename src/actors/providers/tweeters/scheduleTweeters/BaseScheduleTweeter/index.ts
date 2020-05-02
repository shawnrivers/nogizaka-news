import * as Twit from 'twit';
import { WebScraper } from '../../../../fechers/WebScraper';
import { TweetPoster } from '../../../../posters/TweetPoster';

export class BaseScheduleTweeter {
  private webScrapers: { [id: string]: WebScraper };
  protected tweetPoster: TweetPoster;

  constructor(twitter: Twit) {
    this.tweetPoster = new TweetPoster(twitter);
    this.webScrapers = {};
  }

  protected async addDOMSelector({
    url,
    scraperId,
  }: {
    url: string;
    scraperId: string;
  }): Promise<CheerioStatic | null> {
    const webScraper = new WebScraper();
    await webScraper.init(url);
    this.webScrapers[scraperId] = webScraper;
    return webScraper.getSelector();
  }

  public getDOMSelector(id: string): CheerioStatic | null {
    return this.webScrapers[id].getSelector();
  }
}
