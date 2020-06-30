import * as Twit from 'twit';
import { AccountId } from '../../providers/retweeters/TextRelativeRetweeter/accounts';

export type AccountType = 'nogizaka' | 'media' | 'member';

export type WatchingAccount = {
  id: AccountId;
  count: number;
  type: AccountType;
};

type ResponseIndices = [number, number];

export type GetTweetResponseData = {
  id: number;
  id_str: string;
  created_at: string;
  user: {
    id_str: string;
    screen_name: string;
  };
  text: string;
  entities: {
    hashtags: {
      text: string;
      indices: ResponseIndices;
    }[];
    urls: {
      url: string;
      expanded_url: string;
      display_url: string;
      indices: ResponseIndices;
    }[];
  };
};

export type GetTweetResponse = Omit<Twit.PromiseResponse, 'data'> & {
  data: GetTweetResponseData[];
};

export type Tweet = {
  id: string;
  createdDate: Date;
  userId: string;
  userName: string;
  text: string;
};

export type LastTweets = {
  [accountId: string]: {
    tweetId: string | null;
  };
};

export type AccountTweets = {
  accountId: AccountId;
  tweets: Tweet[];
};
