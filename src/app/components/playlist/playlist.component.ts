import { Component, OnInit } from '@angular/core';
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
export class PlaylistComponent implements OnInit {
  playlist: Observable<{ tracks: Track[], trackId: number }>;
  chosenTrack: number;

  constructor(
    private store: Store<fromApp.AppState>,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.playlist = this.store.select('playlist');
    this.store.dispatch(new playlistActions.FetchPlaylist());
    // const ref = this.fireStorage.ref('tracks/Bones-XLR.mp3');
    // ref.getDownloadURL().subscribe(val => console.log(val));
  }

  chooseTrack(index: number) {
    this.chosenTrack = index;
    this.store.dispatch(new playlistActions.ChooseTrack(index));
  }

  uploadFile(event) {
    console.log(event);
    const file = event.target.files[0];
    const filePath = `tracks/${event.target.files[0].name}`;
    const ref = this.fireStorage.ref(filePath);
    const task = ref.put(file);
    task.percentageChanges().subscribe(val => {
      console.log(val);
    });
  }
}
