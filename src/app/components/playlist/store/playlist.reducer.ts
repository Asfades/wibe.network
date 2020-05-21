import { Track } from '@entities/track.model';
import * as playlistActions from './playlist.actions';

export interface State {
  tracks: Track[];
  trackId: number;
}

const initialState: State = {
  tracks: [
    // {
    //   filePath: 'http://localhost:4200/assets/Bones-Rap.mp3',
    //   artist: 'Bones',
    //   name: 'Rap'
    // },
    // {
    //   filePath: 'http://localhost:4200/assets/Tempo.mp3',
    //   artist: 'Bones',
    //   name: 'Tempo'
    // },
    // {
    //   filePath: 'http://localhost:4200/assets/Bones-XLR.mp3',
    //   artist: 'Bones',
    //   name: 'XLR'
    // },
    // {
    //   filePath: 'http://localhost:4200/assets/Bones-ChampagneInTheGraveyard.mp3',
    //   artist: 'Bones',
    //   name: 'ChampagneInTheGraveyard'
    // },
    // {
    //   filePath: 'http://localhost:4200/assets/no-sleep.mp3',
    //   artist: 'unknown',
    //   name: 'no-sleep'
    // }
  ],
  trackId: null
};

export function playlistReducer(
  state: State = initialState,
  action: playlistActions.PlaylistActions
) {
  switch (action.type) {
    case playlistActions.FETCH_PLAYLIST:
      return {
        ...state
      };
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
