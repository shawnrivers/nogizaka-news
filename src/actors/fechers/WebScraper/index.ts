import * as cheerio from 'cheerio';
import * as req from 'request-promise';

export class WebScraper {
  private $: CheerioStatic | null;

  constructor() {
    this.$ = null;
  }

  public async init(url: string): Promise<void> {
    try {
      const html = await req(url);
      this.$ = cheerio.load(html);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  public getSelector(): CheerioStatic | null {
    if (this.$ === null) {
      console.log('Error: Run WebScraper.int(url) first to get the selector functioning.');
    }
    return this.$;
  }
}
