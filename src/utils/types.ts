import { ScheduleType } from './constants';

export type IScheduleType = {
  name: ScheduleType;
  displayName: string;
};

export type ITypeSchedules = {
  type: IScheduleType;
  data: string[];
};
