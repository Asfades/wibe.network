import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';

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
  currentTime = 0;

  constructor(
    private store: Store<fromApp.AppState>,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.player = this.store.select('player');
    this.playerSub = this.player.subscribe((state) => {
      this.isPlaying = state.isPlaying;
    });
    this.playerService.timeUpdate$.subscribe(time => {
      this.currentTime = time;
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
  spacebarUpEvent(event: KeyboardEvent) {
    const spaceKey = event.code === 'Space';
    const bool = typeof(this.isPlaying) === 'boolean';
    const input = event.target instanceof HTMLInputElement;
    if (spaceKey && bool && !input) {
      this.isPlaying ? this.pause() : this.play();
    }
  }

  @HostListener('window:keydown', ['$event'])
  spacebarDownEvent(event: KeyboardEvent) {
    if (event.code === 'Space' && event.target === document.body) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }
}
