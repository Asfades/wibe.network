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
  currentTime = 0;

  amplitudeArray$: Subject<Uint8Array> = new Subject();

  constructor(
    private playerService: PlayerService
  ) {
    this.playerService.audio$.subscribe((audioEl: HTMLAudioElement) => {
      this.setupAudioNodes(audioEl);
    });
  }


  private setupAudioNodes(audioEl: HTMLAudioElement) {
    this.audioContext = new AudioContext();
    // this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
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
  }
}
