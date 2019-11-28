# [Nogizaka46 News](https://twitter.com/n46_news)

README: [日本語](https://github.com/shawnrivers/nogizaka-news/blob/master/README.md), [English](https://github.com/shawnrivers/nogizaka-news/blob/master/README.en.md)

**Nogizaka46 News** ([@n46_news](https://twitter.com/n46_news)) is a [Node.js](https://nodejs.org/en/) Twitter Bot for retweeting news about [Nogizaka46](https://en.wikipedia.org/wiki/Nogizaka46) and tweeting the schedules of its members.

## Technologies

- Language: [`TypeScript`](https://www.typescriptlang.org/)
- Twitter API client: [`Twit`](https://github.com/ttezel/twit)
- Fetch tool: [`request`](https://github.com/request/request)
- Web Scraping tool: [`cheerio`](https://github.com/cheeriojs/cheerio)

## Features

- Retweet Nogizaka46 news
  - Retweet from Nogizaka46 official accounts:
    - 乃木坂 46 ([@nogizaka46](https://twitter.com/nogizaka46))
    - 乃木坂工事中 ([@nogikmax](https://twitter.com/nogikmax))
  - Retweet Nogizaka46 relative tweets from media accounts
    - Yahoo!ニュース ([@YahooNewsTopics](https://twitter.com/YahooNewsTopics))
    - LINE NEWS ([@news_line_me](https://twitter.com/news_line_me))
    - ORICON NEWS ([@oricon](https://twitter.com/oricon))
    - モデルプレス ([@modelpress](https://twitter.com/modelpress))
    - 日刊スポーツ ([@nikkansports](https://twitter.com/nikkansports))
    - 音楽ナタリー ([@natalie_mu](https://twitter.com/natalie_mu))
    - MANTANWEB ([@mantanweb](https://twitter.com/mantanweb))
- Tweet the schedules of members every day at 1:00 a.m. Tokyo time
  - Schedules data of current members are from [Nogizaka46 official site](http://www.nogizaka46.com/).
  - Schedules data of graduated members are from their official websites:
    - [西野七瀬 Official Site](https://nishinonanase.com/)
    - [若月佑美 Official Site](https://wakatsukiyumi.jp/)
    - [生駒里奈 Official Site](https://ikomarina.com/)
  - _NOTE_: I only provide graduated members schedules of 西野七瀬, 若月佑美, 生駒里奈 currently. I will gradually add more supports to other graduates.
- Retweet the schedules of [のぎおび SHOWROOM](https://www.showroom-live.com/campaign/nogizaka46_sr)
  - Retweet from SHOWROOM ([@SHOWROOM_jp](https://twitter.com/SHOWROOM_jp))
