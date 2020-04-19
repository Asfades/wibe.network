import { Action } from '@ngrx/store';

export const CHOOSE_TRACK = '[Playlist] Choose Track';
export const CHOOSE_NEXT = '[Playlist] Choose Next';
export const CHOOSE_PREV = '[Playlist] Choose Previous';

export class ChooseTrack implements Action {
  readonly type = CHOOSE_TRACK;

  constructor(public payload: number) {}
}

export class ChooseNext implements Action {
  readonly type = CHOOSE_NEXT;
}

export class ChoosePrev implements Action {
  readonly type = CHOOSE_PREV;
}

export type PlaylistActions =
  | ChooseTrack
  | ChooseNext
  | ChoosePrev;
