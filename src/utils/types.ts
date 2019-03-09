import { ScheduleType } from './constants';

export type IScheduleType = {
  name: ScheduleType;
  displayName: string;
};

export type ITypeSchedules = {
  type: IScheduleType;
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
