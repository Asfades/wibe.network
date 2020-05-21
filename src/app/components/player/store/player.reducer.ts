import { Track } from '@entities/track.model';
import * as playerActions from './player.actions';

export interface State extends Track {
  filePath: string;
  artist: string;
  name: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean | undefined;
  isNextPresent: boolean | undefined;
  isPrevPresent: boolean | undefined;
}

const initialState: State = {
  filePath: '',
  artist: '',
  name: '',
  currentTime: 0,
  duration: 0,
  isPlaying: undefined,
  isNextPresent: undefined,
  isPrevPresent: undefined
};

export function playerReducer(
  state: State = initialState,
  action: playerActions.PlayerActions
) {
  switch (action.type) {
    case playerActions.PLAY:
      return {
        ...state,
        isPlaying: true
      };
    case playerActions.PAUSE:
      return {
        ...state,
        isPlaying: false
      };
    case playerActions.SET_TRACK:
      return {
        ...state,
        ...action.payload,
        isPlaying: true
      };
    case playerActions.PREV_DISABLED:
      return {
        ...state,
        isPrevPresent: false
      };
    case playerActions.PREV_ENABLED:
      return {
        ...state,
        isPrevPresent: true
      };
    case playerActions.NEXT_DISABLED:
      return {
        ...state,
        isNextPresent: false
      };
    case playerActions.NEXT_ENABLED:
        return {
          ...state,
          isNextPresent: true
        };
    case playerActions.SET_DURATION:
      return {
        ...state,
        duration: action.payload
      };
    default:
      return state;
  }
}
