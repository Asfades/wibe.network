import { Action } from '@ngrx/store';

import { Track } from '@entities/track.model';

export const PLAY = '[Player] Play';
export const PAUSE = '[Player] Pause';
export const SET_TRACK = '[Player] Set Track';
export const SET_DURATION = '[Player] Set Duration';
export const UPDATE_CURRENT_TIME = '[Player] Update Current Time';
export const UPDATE_TIME = '[Player] Update Time';
export const PREV_DISABLED = '[Player] PREVIOUS Control is Disabled';
export const PREV_ENABLED = '[Player] PREVIOUS Control is Enabled';
export const NEXT_DISABLED = '[Player] NEXT Control is Disabled';
export const NEXT_ENABLED = '[Player] NEXT Control is Enabled';

export class Play implements Action {
  readonly type = PLAY;
}

export class Pause implements Pause {
  readonly type = PAUSE;
}

export class SetTrack implements Action {
  readonly type = SET_TRACK;

  constructor(public payload: Track) {}
}

export class UpdateCurrentTime implements Action {
  readonly type = UPDATE_CURRENT_TIME;

  constructor(public payload: number) {}
}

export class UpdateTime implements Action {
  readonly type = UPDATE_TIME;

  constructor(public payload: number) {}
}

export class PrevDisabled implements Action {
  readonly type = PREV_DISABLED;
}

export class PrevEnabled implements Action {
  readonly type = PREV_ENABLED;
}

export class NextDisabled implements Action {
  readonly type = NEXT_DISABLED;
}

export class NextEnabled implements Action {
  readonly type = NEXT_ENABLED;
}

export class SetDuration implements Action {
  readonly type = SET_DURATION;

  constructor(public payload: number) {}
}

export type PlayerActions =
  | Play
  | Pause
  | SetTrack
  | PrevDisabled
  | PrevEnabled
  | NextDisabled
  | NextEnabled
  | SetDuration
  | UpdateCurrentTime
  | UpdateTime;
