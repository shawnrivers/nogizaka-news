# [Nogizaka46 News](https://twitter.com/n46_news)

README: [English](https://github.com/shawnrivers/nogizaka-news/blob/master/README.en.md), [日本語](https://github.com/shawnrivers/nogizaka-news/blob/master/README.md)

**Nogizaka46 News** ([@n46_news](https://twitter.com/n46_news)) は、[乃木坂46](https://ja.wikipedia.org/wiki/%E4%B9%83%E6%9C%A8%E5%9D%8246)関連のニュースとスケジュールをツイートする [Node.js](https://nodejs.org/en/) のツイーターボットである。

## 技術

- 言語：[`TypeScript`](https://www.typescriptlang.org/)
- Twitter API クライアント：[`Twit`](https://github.com/ttezel/twit)
- データフェッチツール：[`request`](https://github.com/request/request)
- ウェブスクレイピングツール：[`cheerio`](https://github.com/cheeriojs/cheerio)

## 機能

- 乃木坂46のニュースをリツイート
  - 乃木坂46の公式アカウントからリツイート：
    - 乃木坂46（[@nogizaka46](https://twitter.com/nogizaka46)）
    - 乃木坂工事中（[@nogikmax](https://twitter.com/nogikmax)）
  - メディアアカウントから乃木坂46関連のツイートをリツイート：
    - Yahoo!ニュース（[@YahooNewsTopics](https://twitter.com/YahooNewsTopics)）
    - LINE NEWS（[@news_line_me](https://twitter.com/news_line_me)）
    - ORICON NEWS（[@oricon](https://twitter.com/oricon)）
    - モデルプレス（[@modelpress](https://twitter.com/modelpress)）
    - 日刊スポーツ（[@nikkansports](https://twitter.com/nikkansports)）
    - 音楽ナタリー（[@natalie_mu](https://twitter.com/natalie_mu)）
    - MANTANWEB（[@mantanweb](https://twitter.com/mantanweb)）
    - Real Sound（[@realsoundjp](https://twitter.com/realsoundjp)）
- 毎日東京時間午前 1 時にメンバーのスケジュールをツイート：
  - 現メンバーのスケジュールは[乃木坂46公式サイト](http://www.nogizaka46.com/)から
  - 卒業メンバーのスケジュールはそれぞれの公式サイトから：
    - [西野七瀬公式サイト](https://nishinonanase.com/)
    - [生駒里奈公式サイト](https://ikomarina.com/)
- [のぎおび SHOWROOM](https://www.showroom-live.com/campaign/nogizaka46_sr) のスケジュールをリツイート
  - リツイート先：SHOWROOM（[@SHOWROOM_jp](https://twitter.com/SHOWROOM_jp)）
