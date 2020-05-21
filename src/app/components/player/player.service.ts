import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';

import * as fromApp from '@store/app.reducer';
import * as playlistActions from '@playlist/store/playlist.actions';
import * as playerActions from './store/player.actions';

@Injectable({providedIn: 'root'})
export class PlayerService {
  readonly audioElement = new Audio();
  timeUpdate$ = new BehaviorSubject<number>(0);

  constructor(
    private store: Store<fromApp.AppState>
  ) {
    this.audioElement.crossOrigin = 'anonymous';
  }

  setTrack(url: string) {
    if (url) {
      this.audioElement.src = url;
      this.audioElement.load();

      this.audioElement.onloadeddata = () => {
        this.store.dispatch(new playerActions.SetDuration(Math.floor(this.audioElement.duration)));
        this.play();
      };

      this.audioElement.ontimeupdate = () => {
        this.timeUpdate$.next(this.audioElement.currentTime);
      };
    }
  }

  changeCurrentTime(time: number) {
    this.audioElement.currentTime = time;
  }

  play() {
    this.store.dispatch(new playerActions.Play());

    if (this.audioElement.src.length) {
      this.audioElement.play();
      this.audioElement.onended = () => {
        this.store.dispatch(new playlistActions.ChooseNext());
      };
    }
  }

  pause() {
    this.store.dispatch(new playerActions.Pause());
    this.audioElement.pause();
  }

  next() {
    this.store.dispatch(new playlistActions.ChooseNext());
  }

  previous() {
    this.store.dispatch(new playlistActions.ChoosePrev());
  }
}
