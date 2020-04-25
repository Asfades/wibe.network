import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromApp from '@store/app.reducer';
import * as playlistActions from '@playlist/store/playlist.actions';
import * as playerActions from './store/player.actions';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioObj = new Audio();
  audio$: Subject<HTMLAudioElement> = new Subject();

  constructor(
    private store: Store<fromApp.AppState>
  ) {
    console.log('hello, from player service constructor');
  }

  setTrack(url: string) {
    if (url) {
      this.audioObj.src = url;
      this.audioObj.load();

      this.audioObj.onloadeddata = () => {
        this.store.dispatch(new playerActions.SetDuration(Math.floor(this.audioObj.duration)));
        this.audio$.next(this.audioObj);
        this.play();
      };

      this.audioObj.ontimeupdate = () => {
        this.store.dispatch(new playerActions.UpdateCurrentTime(this.audioObj.currentTime));
      };
    }
  }

  changeCurrentTime(time: number) {
    this.audioObj.currentTime = time;
  }

  play() {
    this.store.dispatch(new playerActions.Play());

    if (this.audioObj.src.length) {
      this.audioObj.play();
      this.audioObj.onended = () => {
        this.store.dispatch(new playlistActions.ChooseNext());
      };
    }
  }

  pause() {
    this.store.dispatch(new playerActions.Pause());
    this.audioObj.pause();
  }

  next() {
    this.store.dispatch(new playlistActions.ChooseNext());
  }

  previous() {
    this.store.dispatch(new playlistActions.ChoosePrev());
  }
}
