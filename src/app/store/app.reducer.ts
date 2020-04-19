import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';

import * as fromPlayer from '../components/player/store/player.reducer';
import * as fromPlaylist from '../components/playlist/store/playlist.reducer';

export interface AppState {
  player: fromPlayer.State;
  playlist: fromPlaylist.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  player: fromPlayer.playerReducer,
  playlist: fromPlaylist.playlistReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
