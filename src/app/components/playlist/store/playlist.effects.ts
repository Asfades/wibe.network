import { Injectable } from '@angular/core';
import { switchMap, catchError, map, tap, withLatestFrom } from 'rxjs/operators';

import { Store, Action } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';

import * as playlistActions from './playlist.actions';
import * as playerActions from '@player/store/player.actions';
import * as fromApp from '@store/app.reducer';
import { PlayerService } from '@player/player.service';
import { AudioService } from '@services/audio.service';

@Injectable()
export class PlaylistEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private playerService: PlayerService,
    private audioService: AudioService
  ) {}

  @Effect()
  switchTrack = this.actions$.pipe(
    ofType(playlistActions.CHOOSE_NEXT, playlistActions.CHOOSE_PREV, playlistActions.CHOOSE_TRACK),
    withLatestFrom(this.store.select('playlist')),
    switchMap(([actionData, playlistState]) => {
        const track = playlistState.tracks[playlistState.trackId];
        const nextAvailable = playlistState.tracks.length > (playlistState.trackId + 1);
        const prevAvailable = playlistState.trackId > 0;
        const actionsToDispatch: Action[] = [];
        if (track) {
          this.playerService.setTrack(track.filePath);
          // this.audioService.setTrack(track.filePath);
          actionsToDispatch.push(new playerActions.SetTrack(track));
        }
        if (nextAvailable) {
          actionsToDispatch.push(new playerActions.NextEnabled());
        } else {
          actionsToDispatch.push(new playerActions.NextDisabled());
        }
        if (prevAvailable) {
          actionsToDispatch.push(new playerActions.PrevEnabled());
        } else {
          actionsToDispatch.push(new playerActions.PrevDisabled());
        }
        return actionsToDispatch;
      }
    )
  );
}
