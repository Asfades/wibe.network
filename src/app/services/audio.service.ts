import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';

import * as fromApp from '@store/app.reducer';
import * as playlistActions from '@playlist/store/playlist.actions';
import * as playerActions from '@player/store/player.actions';
import { PlayerService } from '../components/player/player.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext: AudioContext;
  sampleSize = 1024;  // number of samples to collect before analyzing data
  audioBuffer: AudioBuffer;
  sourceNode: MediaElementAudioSourceNode; // AudioBufferSourceNode; // = this.audioContext.createBufferSource();
  analyserNode: AnalyserNode; // = this.audioContext.createAnalyser();
  javascriptNode: ScriptProcessorNode; // = this.audioContext.createScriptProcessor(this.sampleSize, 1, 1);
  audioPlaying = false;
  amplitudeArray: Uint8Array; // = new Uint8Array(this.analyserNode.frequencyBinCount);     // array to hold time domain data
  // This must be hosted on the same server as this page - otherwise you get a Cross Site Scripting error
  // Global variables for the Graphics
  canvasWidth  = 512;
  canvasHeight = 256;
  ctx;
  currentTime = 0;

  amplitudeArray$: Subject<Uint8Array> = new Subject();

  constructor(
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private playerService: PlayerService
  ) {
    this.playerService.audio$.subscribe((audioEl: HTMLAudioElement) => {
      this.setupAudioNodes(audioEl);
    });
  }

  private chooseNext = (() => {
    this.store.dispatch(new playlistActions.ChooseNext());
  }).bind(this);

  setTrack(url: string) {
    if (this.sourceNode) {
      this.sourceNode.removeEventListener('ended', this.chooseNext);
      // this.sourceNode.stop();
    }
    if (url) {
      // this.setupAudioNodes();
      this.loadSound(url);
    }
  }

  updateInfo() {
    // console.log(this.audioContext.currentTime);
    const contextTime = Math.floor(this.audioContext.currentTime);
    if (contextTime > this.currentTime) {
      this.currentTime = contextTime;
      this.store.dispatch(new playerActions.UpdateCurrentTime(contextTime));
    }
    requestAnimationFrame(this.updateInfo.bind(this));
  }

  play() {
    this.audioContext.resume();
    this.store.dispatch(new playerActions.Play());
  }

  pause() {
    this.audioContext.suspend();
    this.store.dispatch(new playerActions.Pause());
  }

  private setupAudioNodes(audioEl: HTMLAudioElement) {
    this.audioContext = new AudioContext();
    // this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
    this.sourceNode.addEventListener('ended', this.chooseNext);
    this.analyserNode = this.audioContext.createAnalyser();
    this.javascriptNode = this.audioContext.createScriptProcessor(this.sampleSize, 1, 1);
    // Create the array for the data values
    this.amplitudeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    // Now connect the nodes together
    this.sourceNode.connect(this.audioContext.destination);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.javascriptNode);
    this.javascriptNode.connect(this.audioContext.destination);
    this.javascriptNode.onaudioprocess = () => {
      this.analyserNode.getByteTimeDomainData(this.amplitudeArray);
      this.amplitudeArray$.next(this.amplitudeArray);
    };
    // this.visualisation$.next({
    //   javascriptNode: this.javascriptNode,
    //   amplitudeArray: this.amplitudeArray
    // });
  }

  private playSound() {
    this.store.dispatch(new playerActions.SetDuration(this.audioBuffer.duration));
    // this.sourceNode.buffer = this.audioBuffer;
    // this.sourceNode.start(0);
    this.updateInfo();
  }

  private loadSound(url: string) {
    this.http.get(url, {
      responseType: 'arraybuffer'
    }).subscribe((response: ArrayBuffer) => {
      this.audioContext.decodeAudioData(response, (buffer: AudioBuffer) => {
        this.audioBuffer = buffer;
        this.playSound();
      }, (err) => {});
    });
  }

}
