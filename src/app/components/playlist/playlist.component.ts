import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as playlistActions from './store/playlist.actions';
import { Track } from '@entities/track.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlist$: Observable<{ tracks: Track[], trackId: number }>;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new playlistActions.FetchPlaylist());
    this.playlist$ = this.store.select('playlist');
  }

  chooseTrack(index: number) {
    this.store.dispatch(new playlistActions.ChooseTrack(index));
  }

  trackByIndex(index: number) {
    return index;
  }
}
