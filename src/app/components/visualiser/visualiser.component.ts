import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';

import { AudioService } from '@src/app/services/audio.service';

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.scss']
})
export class VisualiserComponent implements OnInit, OnDestroy {
  @ViewChild('visualisationCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private animationId: number;
  contextSizes: {
    width: number;
    height: number;
  };

  constructor(
    private audioService: AudioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.contextSizes = {
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height
    };
    this.ctx.fillStyle = '#ffffff';
    this.audioService.amplitudeArray$.subscribe((amplitudeArray: Uint8Array) => {
      this.ngZone.runOutsideAngular(() => {
        this.clearCanvas();
        this.animationId = requestAnimationFrame(this.drawAmplitude(amplitudeArray));
      });
    });
  }

  drawAmplitude(amplitudeArray: Uint8Array) {
    return () => {
      for (let i = 0; i < amplitudeArray.length; i++) {
        const value = amplitudeArray[i] / 256;
        const y = this.contextSizes.height - (this.contextSizes.height * value) - 1;
        this.ctx.fillRect(i, y, 1, 1);
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.contextSizes.width, this.contextSizes.height);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

}
