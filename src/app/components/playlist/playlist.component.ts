import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as playlistActions from './store/playlist.actions';
import { Track } from '@entities/track.model';
import * as fromApp from '../../store/app.reducer';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlist: Observable<{ tracks: Track[], trackId: number }>;
  sub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.sub = this.store.select('auth').subscribe((auth) => {
      if (auth.user.token) {
        this.store.dispatch(new playlistActions.FetchPlaylist());
      }
    });
    this.playlist = this.store.select('playlist');
  }

  chooseTrack(index: number) {
    this.store.dispatch(new playlistActions.ChooseTrack(index));
  }

  trackByIndex(index: number) {
    return index;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
