import { Component, OnInit, OnDestroy } from '@angular/core';
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
  private playerSub: Subscription;
  player: Observable<fromPlayer.State>;
  sliderChange: number;

  constructor(
    private store: Store<fromApp.AppState>,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.player = this.store.select('player');
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
    this.sliderChange = event.value;
  }

  onSliderChangeEnd() {
    if (this.sliderChange) {
      this.playerService.changeCurrentTime(this.sliderChange);
    }
  }

  formatTime(time: number, format: string = 'm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }
}
