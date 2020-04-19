import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as playlistActions from './store/playlist.actions';
import * as playerActions from '@player/store/player.actions';
import { Track } from '@entities/track.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlist: Observable<{ tracks: Track[], trackId: number }>;
  chosenTrack: number;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.playlist = this.store.select('playlist');
  }

  chooseTrack(index: number) {
    this.chosenTrack = index;
    this.store.dispatch(new playlistActions.ChooseTrack(index));
  }
}
