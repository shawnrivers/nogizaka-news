import { NogizakaScheduleType } from './constants';

export type ITypeSchedule = {
  type: string;
  schedule: {
    date: string,
    title: string,
    memberName: string,
  };
};

export type ITypeSchedules = {
  type: string;
  data: string[];
};

export type IWatchedAccount = {
  id: string;
  count: number;
};

export type ITweet = {
  id: string;
  createdDate: Date;
  userName: string;
  text: string;
};
