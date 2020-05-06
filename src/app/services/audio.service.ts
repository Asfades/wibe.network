import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { PlayerService } from '../components/player/player.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext: AudioContext;
  sampleSize = 1024;
  sourceNode: MediaElementAudioSourceNode;
  analyserNode: AnalyserNode;
  javascriptNode: ScriptProcessorNode;
  amplitudeArray: Uint8Array;

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
    this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
    this.analyserNode = this.audioContext.createAnalyser();
    this.javascriptNode = this.audioContext.createScriptProcessor(this.sampleSize, 1, 1);
    this.amplitudeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.sourceNode.connect(this.audioContext.destination);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.javascriptNode);
    this.javascriptNode.connect(this.audioContext.destination);
    this.javascriptNode.onaudioprocess = () => {
      if (!audioEl.paused) {
        this.analyserNode.getByteTimeDomainData(this.amplitudeArray);
        this.amplitudeArray$.next(this.amplitudeArray);
      }
    };
  }
}
