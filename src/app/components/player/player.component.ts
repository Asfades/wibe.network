import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as moment from 'moment';

import * as fromApp from '@store/app.reducer';
import * as fromPlayer from './store/player.reducer';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  private sliderChangeVal: number;
  private isPlaying = null;
  private playerSub: Subscription;
  player: Observable<fromPlayer.State>;

  constructor(
    private store: Store<fromApp.AppState>,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.player = this.store.select('player');
    this.playerSub = this.player.subscribe((state) => {
      this.isPlaying = state.isPlaying;
    });
  }

  play() {
    this.playerService.play();
  }

  pause() {
    this.playerService.pause();
  }

  previous() {
    this.playerService.previous();
  }

  next() {
    this.playerService.next();
  }

  onSliderChange(event) {
    this.sliderChangeVal = event.value;
  }

  onSliderChangeEnd() {
    if (this.sliderChangeVal) {
      this.playerService.changeCurrentTime(this.sliderChangeVal);
    }
  }

  formatTime(time: number, format: string = 'm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space' && typeof(this.isPlaying) === 'boolean') {
      this.isPlaying ? this.pause() : this.play();
    }
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }
}
