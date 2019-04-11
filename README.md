# Nogizaka News

This is a [Node.js](https://nodejs.org/en/) Twitter bot **Nogizaka News** ([@NewsNogizaka](https://twitter.com/NewsNogizaka)) for retweeting news about [Nogizaka46](https://www.wikiwand.com/ja/%E4%B9%83%E6%9C%A8%E5%9D%8246) and tweeting the schedules of its members.

## Technologies

* Language: [`TypeScript`](https://www.typescriptlang.org/)
* Twitter API client: [`Twit`](https://github.com/ttezel/twit)
* Web Scraping tools: [`request`](https://github.com/request/request), [`cheerio`](https://github.com/cheeriojs/cheerio)

## Features

* Retweet Nogizaka46 news
  * Retweet from Nogizaka46 official accounts:
    * 乃木坂46 ([@nogizaka46](https://twitter.com/nogizaka46))
    * 乃木坂工事中 ([@nogikmax]((https://twitter.com/nogikmax)))
  * Retweet Nogizaka46 relative tweets from media accounts
    * LINE NEWS ([@news_line_me](https://twitter.com/news_line_me))
    * ORICON NEWS ([@oricon](https://twitter.com/oricon))
    * モデルプレス ([@modelpress](https://twitter.com/modelpress))
    * 日刊スポーツ ([@nikkansports](https://twitter.com/nikkansports))
    * 音楽ナタリー ([@natalie_mu](https://twitter.com/natalie_mu))
    * MANTANWEB ([@mantanweb](https://twitter.com/mantanweb))
* Tweet the schedules of members every day at 1:00 a.m. Tokyo time.
  * Schedules data of current members is from [Nogizaka46 official site](http://www.nogizaka46.com/).
  * Schedules data of graduated members is from their official websites:
    * [西野七瀬 Official Site](https://nishinonanase.com/)
    * [若月佑美 Official Site](https://wakatsukiyumi.jp/)
    * [生駒里奈 Official Site](https://ikomarina.com/)
  * *NOTE*: I only provide graduated members schedules of *西野七瀬*, *若月佑美*, *生駒里奈* currently. I will gradually add more supports to other graduates.
