import { NogizakaName } from '../../../../constants/names';
import { TweetRelativeCallback } from './types';

type MemberRetweetRule = (
  memberName: NogizakaName.IkomaRina | NogizakaName.KawagoHina | NogizakaName.WakatsukiYumi,
) => TweetRelativeCallback;

const ikomaRule: TweetRelativeCallback = (text: string) => text.includes('出演情報');
const kawagoRule: TweetRelativeCallback = (text: string) => text.includes('お知らせ');
const wakatsukiRule: TweetRelativeCallback = (text: string) => text.includes('告知');

export const memberRetweetRule: MemberRetweetRule = (memberName) => {
  switch (memberName) {
    case NogizakaName.IkomaRina:
      return ikomaRule;
    case NogizakaName.KawagoHina:
      return kawagoRule;
    case NogizakaName.WakatsukiYumi:
      return wakatsukiRule;
  }
};
