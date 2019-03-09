import { watchAndRetweet } from './actions/retweetNews';
import { scheduleTweet } from './actions/tweetSchedules';

const TWEET_INTERVAL = 1000 * 60 * 15;
const TWEET_SCHEDULE_HOUR = 1;

watchAndRetweet(TWEET_INTERVAL);
scheduleTweet(TWEET_SCHEDULE_HOUR);
