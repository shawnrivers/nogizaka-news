import * as Twit from 'twit';

export type WatchingAccount = {
  id: string;
  count: number;
};

export type GetTweetResponse = Omit<Twit.PromiseResponse, 'data'> & {
  data: {
    id_str: string;
    created_at: string;
    user: {
      id_str: string;
      screen_name: string;
    };
    text: string;
  }[];
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
