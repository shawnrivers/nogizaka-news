export type ScheduleDate = {
  year: string;
  month: string;
  day: string;
};

export type ScheduleWithType = {
  type: string;
  schedule: string[];
};

export type MemberSchedule = {
  title: string;
  date: string;
  memberName: string;
};

export type MemberScheduleWithType = {
  type: string;
  schedule: MemberSchedule;
};
