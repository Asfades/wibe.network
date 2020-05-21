import { Action } from '@ngrx/store';
import { Track } from '@entities/track.model';

export const CHOOSE_TRACK = '[Playlist] Choose Track';
export const CHOOSE_NEXT = '[Playlist] Choose Next';
export const CHOOSE_PREV = '[Playlist] Choose Previous';
export const FETCH_PLAYLIST = '[Playlist] Fetch Playlist';
export const SET_PLAYLIST = '[Playlist] Set Playlist';

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

export class FetchPlaylist implements Action {
  readonly type = FETCH_PLAYLIST;
}

export class SetPlaylist implements Action {
  readonly type = SET_PLAYLIST;

  constructor(public payload: Track[]) {}
}

export type PlaylistActions =
  | ChooseTrack
  | ChooseNext
  | ChoosePrev
  | FetchPlaylist
  | SetPlaylist;
