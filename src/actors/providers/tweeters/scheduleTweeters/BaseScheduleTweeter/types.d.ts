export type ScheduleDate = {
  year: string;
  month: string;
  day: string;
};

export type ScheduleWithType = {
  type: string;
  schedule: string[];
};

export type ScheduleWithTypeLLC = {
  type: string;
  schedule: {
    title: string;
    date: string;
    memberName: string;
  };
};
