import { watchAndRetweet } from './actions/retweetNews';
import { scheduleTweet } from './actions/tweetSchedules';

const TWEET_SCHEDULE_HOUR = 1;
const TWEET_INTERVAL = 1000 * 60 * 15;

scheduleTweet(TWEET_SCHEDULE_HOUR);
watchAndRetweet(TWEET_INTERVAL);
