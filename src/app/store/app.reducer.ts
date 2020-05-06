import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';

import * as fromPlayer from '../components/player/store/player.reducer';
import * as fromPlaylist from '../components/playlist/store/playlist.reducer';
import * as fromAuth from '../pages/auth/store/auth.reducer';

export interface AppState {
  player: fromPlayer.State;
  playlist: fromPlaylist.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  player: fromPlayer.playerReducer,
  playlist: fromPlaylist.playlistReducer,
  auth: fromAuth.authReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
