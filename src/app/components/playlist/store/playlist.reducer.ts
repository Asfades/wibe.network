import { Track } from '@entities/track.model';
import * as playlistActions from './playlist.actions';

export interface State {
  tracks: Track[];
  trackId: number;
}

const initialState: State = {
  tracks: [],
  trackId: null
};

export function playlistReducer(
  state: State = initialState,
  action: playlistActions.PlaylistActions
) {
  switch (action.type) {
    case playlistActions.SET_PLAYLIST:
      return {
        ...state,
        tracks: action.payload
      };
    case playlistActions.CHOOSE_TRACK:
      return {
        tracks: deepCloneTrackList(state.tracks),
        trackId: action.payload
      };
    case playlistActions.CHOOSE_NEXT:
      return {
        tracks: deepCloneTrackList(state.tracks),
        trackId: state.trackId + 1
      };
    case  playlistActions.CHOOSE_PREV:
      return {
        tracks: deepCloneTrackList(state.tracks),
        trackId: state.trackId - 1
      };
    default:
      return state;
  }
}

function deepCloneTrackList(tracks: Track[]): Track[] {
  const quantity = tracks.length;
  const clonedList: Track[] = [];

  for (let i = 0; i < quantity; i++) {
    clonedList.push({
      ...tracks[i]
    });
  }

  return clonedList;
}
